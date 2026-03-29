const { fetchFromNHTSA, parseNHTSAData } = require("../services/nhtsa");
const { fetchFromGemini } = require("../services/gemini");
const Guest = require("../models/Guest");
const jwt = require("jsonwebtoken");

const decodeVIN = async (req, res) => {
  const { vin, region } = req.body;

  if (!vin || !region) {
    return res.status(400).json({ error: "VIN and region are required." });
  }

  // 1. Check if user is authenticated
  let isAuthenticated = false;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET);
      isAuthenticated = true;
    } catch (error) {
      // Token is invalid or expired, treat as guest
      isAuthenticated = false;
    }
  }

  // 2. Enforce 10-search limit for guests
  if (!isAuthenticated) {
    const ip = req.ip || req.connection.remoteAddress;
    let guest = await Guest.findOne({ ipAddress: ip });

    if (guest) {
      if (guest.searchCount >= 10) {
        return res.status(403).json({
          error: "Free search limit reached. Please sign up to continue using the AI decoder.",
          requireSignup: true,
        });
      }
      guest.searchCount += 1;
      guest.lastSearch = Date.now();
      await guest.save();
    } else {
      await Guest.create({ ipAddress: ip });
    }
  }

  // 3. Decoding Logic
  try {
    let nhtsaContext = "";

    if (region === "asean") {
      try {
        const nhtsaRaw = await fetchFromNHTSA(vin);
        const nhtsaData = parseNHTSAData(nhtsaRaw);

        if (nhtsaData.ErrorCode && nhtsaData.ErrorCode.includes("0")) {
          nhtsaContext = `
           CRITICAL CONTEXT: Here is verified data from the NHTSA database for this VIN: 
           - Manufacturer: ${nhtsaData.Make}
           - Model: ${nhtsaData.Model}
           - Year: ${nhtsaData.ModelYear}
           - Body: ${nhtsaData.BodyClass}
           - Engine: ${nhtsaData.DisplacementL || "Unknown"}L
           - Doors: ${nhtsaData.Doors || "Unknown"}
           
           Use this exact data to populate the technical fields. Only use your generative capabilities to determine the market_segment, estimated_eth_price_range, and confidence_score.`;
        } else {
          nhtsaContext = `The NHTSA database failed to decode this VIN. Rely entirely on your training data to guess the vehicle details.`;
        }
      } catch (nhtsaError) {
        console.warn("NHTSA fetch failed/timed out, falling back to Gemini only:", nhtsaError.message);
        nhtsaContext = `The external database is unreachable. Rely entirely on your training data to guess the vehicle details.`;
      }
    }

    const basePrompt = `Act as a professional automotive VIN decoder specializing in Ethiopian imports. Decode this ${region.toUpperCase()} VIN/Chassis Number: ${vin}. Estimate the price in ETB for the Ethiopian market based on high import duties and 2026 trends. Return ONLY a JSON object with keys: vin, manufacturer, model, year, body_type, engine_specs, seating_capacity, market_segment, estimated_eth_price_range, confidence_score. You must include the original vin '${vin}' in the 'vin' field.`;

    const finalPrompt = `${basePrompt} ${nhtsaContext}`;
    const geminiResult = await fetchFromGemini(finalPrompt);

    res.json(geminiResult);
  } catch (error) {
    console.error("Decoding Error:", error);
    res.status(500).json({ error: "Failed to process the decode request." });
  }
};

module.exports = { decodeVIN };
