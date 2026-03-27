const fetchFromNHTSA = async (vin) => {
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
  if (!response.ok) throw new Error("NHTSA API failed");
  return response.json();
};

const parseNHTSAData = (data) => {
  const parsed = {};
  if (!data || !data.Results) return parsed;

  data.Results.forEach((item) => {
    if (item.Variable && item.Value) {
      parsed[item.Variable] = item.Value;
    }
  });

  return {
    ErrorCode: parsed["Error Code"] || "Unknown",
    Make: parsed["Make"] || "Unknown",
    Model: parsed["Model"] || "Unknown",
    ModelYear: parsed["Model Year"] || "Unknown",
    BodyClass: parsed["Body Class"] || "Unknown",
    DisplacementL: parsed["Displacement (L)"] || "Unknown",
    Doors: parsed["Doors"] || "Unknown",
  };
};

module.exports = { fetchFromNHTSA, parseNHTSAData };
