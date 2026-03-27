const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    vin: { type: SchemaType.STRING },
    manufacturer: { type: SchemaType.STRING },
    model: { type: SchemaType.STRING },
    year: { type: SchemaType.STRING },
    body_type: { type: SchemaType.STRING },
    engine_specs: { type: SchemaType.STRING },
    seating_capacity: { type: SchemaType.INTEGER },
    market_segment: { type: SchemaType.STRING },
    estimated_eth_price_range: { type: SchemaType.STRING },
    confidence_score: { type: SchemaType.NUMBER },
  },
  required: ["vin", "manufacturer", "model", "year", "body_type", "engine_specs", "seating_capacity", "market_segment", "estimated_eth_price_range", "confidence_score"],
};

const fetchFromGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};

module.exports = { fetchFromGemini };
