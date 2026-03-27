const { fetchFromNHTSA, parseNHTSAData } = require("../services/nhtsa.js");
const { fetchFromGemini } = require("../services/gemini.js");

const decodeVIN = async (req, res) => {
  const { vin, region } = req.body;

  if (!vin || !region) {
    return res.status(400).json({ error: "VIN and region are required." });
  }

  try {
    let nhtsaContext = "";

    // 1. Fetch from NHTSA if ASEAN
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

    // 2. Build the Gemini Prompt
    const basePrompt = `Act as a professional automotive VIN decoder specializing in Ethiopian imports. Decode this ${region.toUpperCase()} VIN/Chassis Number: ${vin}. Estimate the price in ETB for the Ethiopian market based on high import duties and 2026 trends. Return ONLY a JSON object with keys: manufacturer, model, year, body_type, engine_specs, seating_capacity, market_segment, estimated_eth_price_range, confidence_score.`;

    const finalPrompt = `${basePrompt} ${nhtsaContext}`;

    // 3. Call Gemini with the combined prompt
    const geminiResult = await fetchFromGemini(finalPrompt);

    // 4. Send final JSON to frontend
    res.json(geminiResult);
  } catch (error) {
    console.error("Decoding Error:", error);
    res.status(500).json({ error: "Failed to process the decode request." });
  }
};

module.exports = { decodeVIN };
