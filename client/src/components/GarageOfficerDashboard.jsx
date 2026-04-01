import React, { useState } from "react";

const GarageOfficerDashboard = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inspectionItems = [
    "Engine",
    "Electrical System",
    "Clutch",
    "Gearbox",
    "Transmission",
    "Differential",
    "Suspension",
    "Body",
    "Steering",
    "Air Conditioning",
    "Wheels",
    "Turbo",
    "Fuel System",
    "Engine Idle",
    "Engine Temperature",
    "Dashboard Lights",
  ];

  const initialInspectionState = inspectionItems.reduce((acc, item) => {
    acc[item] = { status: "Good", notes: "" };
    return acc;
  }, {});

  const [formData, setFormData] = useState({
    // Page 1: Intake
    plateNumber: "",
    chassisNumber: "",
    engineNumber: "",
    vehicleMake: "",
    vehicleModel: "",
    year: "",
    fuelType: "Petrol",
    currentOdometer: "",
    color: "",
    // Page 2: Inspection
    inspection: initialInspectionState,
    // Page 3: Diagnostic Report
    diagnosticReports: [{ issueTitle: "", errorCode: "", symptoms: "", probableCause: "", severity: "Low" }],
    // Page 4: Engine Diagnostics
    checkEngineLight: false,
    detectedErrorCodes: "",
    engineCondition: "Normal",
    engineNoise: "None",
    oilLeak: "None",
    smokeColor: "None",
    overheating: false,
    sensorIssues: "",
    // Page 5: Summary
    overallCondition: "Good",
    mainProblems: "",
    recommendedFixes: "",
    mechanicNotes: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleInspectionChange = (item, field, value) => {
    setFormData({
      ...formData,
      inspection: {
        ...formData.inspection,
        [item]: { ...formData.inspection[item], [field]: value },
      },
    });
  };

  const addDiagnosticRow = () => {
    setFormData({
      ...formData,
      diagnosticReports: [...formData.diagnosticReports, { issueTitle: "", errorCode: "", symptoms: "", probableCause: "", severity: "Low" }],
    });
  };

  const handleDiagnosticChange = (index, field, value) => {
    const updatedReports = [...formData.diagnosticReports];
    updatedReports[index][field] = value;
    setFormData({ ...formData, diagnosticReports: updatedReports });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Backend integration will go here
    console.log("Submitting:", formData);
    setMessage("Form submission logic pending backend route creation.");
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-xl border border-slate-200">
      <h2 className="text-3xl font-extrabold mb-2">Maintenance & Inspection Form</h2>
      <p className="text-sm font-bold text-slate-400 uppercase mb-8">Step {step} of 5</p>

      {error && <p className="text-red-500 font-bold mb-4">{error}</p>}
      {message && <p className="text-green-500 font-bold mb-4">{message}</p>}

      <form onSubmit={step === 5 ? handleSubmit : (e) => e.preventDefault()}>
        {/* STEP 1: VEHICLE INTAKE */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="plateNumber" placeholder="Plate Number" value={formData.plateNumber} onChange={handleInputChange} className="p-3 border rounded" required />
            <input type="text" name="chassisNumber" placeholder="VIN / Chassis Number" value={formData.chassisNumber} onChange={handleInputChange} className="p-3 border rounded" required />
            <input type="text" name="engineNumber" placeholder="Engine Number" value={formData.engineNumber} onChange={handleInputChange} className="p-3 border rounded" />
            <input type="text" name="vehicleMake" placeholder="Make" value={formData.vehicleMake} onChange={handleInputChange} className="p-3 border rounded" required />
            <input type="text" name="vehicleModel" placeholder="Model" value={formData.vehicleModel} onChange={handleInputChange} className="p-3 border rounded" required />
            <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleInputChange} className="p-3 border rounded" required />
            <select name="fuelType" value={formData.fuelType} onChange={handleInputChange} className="p-3 border rounded">
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
            <input type="number" name="currentOdometer" placeholder="Current Odometer (km)" value={formData.currentOdometer} onChange={handleInputChange} className="p-3 border rounded" required />
            <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleInputChange} className="p-3 border rounded" />
          </div>
        )}

        {/* STEP 2: INSPECTION CHECKLIST */}
        {step === 2 && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {inspectionItems.map((item) => (
              <div key={item} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded border">
                <span className="col-span-4 font-bold text-slate-700">{item}</span>
                <select className="col-span-3 p-2 border rounded" value={formData.inspection[item].status} onChange={(e) => handleInspectionChange(item, "status", e.target.value)}>
                  <option value="Good">Good</option>
                  <option value="Issue">Issue</option>
                  <option value="Critical">Critical</option>
                </select>
                <input
                  type="text"
                  placeholder="Notes..."
                  className="col-span-5 p-2 border rounded"
                  value={formData.inspection[item].notes}
                  onChange={(e) => handleInspectionChange(item, "notes", e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* STEP 3: DIAGNOSTIC REPORT */}
        {step === 3 && (
          <div className="space-y-6">
            {formData.diagnosticReports.map((report, index) => (
              <div key={index} className="p-4 border rounded bg-slate-50 space-y-3 relative">
                <h4 className="font-bold text-slate-500 uppercase text-xs">Issue {index + 1}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Issue Title" value={report.issueTitle} onChange={(e) => handleDiagnosticChange(index, "issueTitle", e.target.value)} className="p-3 border rounded" />
                  <input type="text" placeholder="Error Code" value={report.errorCode} onChange={(e) => handleDiagnosticChange(index, "errorCode", e.target.value)} className="p-3 border rounded" />
                </div>
                <textarea placeholder="Symptoms" value={report.symptoms} onChange={(e) => handleDiagnosticChange(index, "symptoms", e.target.value)} className="w-full p-3 border rounded h-20" />
                <textarea
                  placeholder="Probable Cause"
                  value={report.probableCause}
                  onChange={(e) => handleDiagnosticChange(index, "probableCause", e.target.value)}
                  className="w-full p-3 border rounded h-20"
                />
                <select value={report.severity} onChange={(e) => handleDiagnosticChange(index, "severity", e.target.value)} className="w-full p-3 border rounded">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            ))}
            <button type="button" onClick={addDiagnosticRow} className="text-blue-600 font-bold p-2 border border-blue-600 rounded w-full hover:bg-blue-50">
              + Add Another Issue
            </button>
          </div>
        )}

        {/* STEP 4: ENGINE DIAGNOSTICS */}
        {step === 4 && (
          <div className="grid grid-cols-2 gap-6">
            <label className="flex items-center space-x-3 p-3 border rounded bg-slate-50">
              <input type="checkbox" name="checkEngineLight" checked={formData.checkEngineLight} onChange={handleInputChange} className="w-5 h-5" />
              <span className="font-bold">Check Engine Light On</span>
            </label>
            <input
              type="text"
              name="detectedErrorCodes"
              placeholder="Detected Error Codes (comma separated)"
              value={formData.detectedErrorCodes}
              onChange={handleInputChange}
              className="p-3 border rounded"
            />

            <select name="engineCondition" value={formData.engineCondition} onChange={handleInputChange} className="p-3 border rounded">
              <option value="Normal">Condition: Normal</option>
              <option value="Weak">Condition: Weak</option>
              <option value="Critical">Condition: Critical</option>
            </select>

            <select name="engineNoise" value={formData.engineNoise} onChange={handleInputChange} className="p-3 border rounded">
              <option value="None">Noise: None</option>
              <option value="Minor">Noise: Minor</option>
              <option value="Loud">Noise: Loud</option>
            </select>

            <select name="oilLeak" value={formData.oilLeak} onChange={handleInputChange} className="p-3 border rounded">
              <option value="None">Oil Leak: None</option>
              <option value="Minor">Oil Leak: Minor</option>
              <option value="Major">Oil Leak: Major</option>
            </select>

            <select name="smokeColor" value={formData.smokeColor} onChange={handleInputChange} className="p-3 border rounded">
              <option value="None">Smoke: None</option>
              <option value="White">Smoke: White</option>
              <option value="Black">Smoke: Black</option>
              <option value="Blue">Smoke: Blue</option>
            </select>

            <label className="flex items-center space-x-3 p-3 border rounded bg-slate-50">
              <input type="checkbox" name="overheating" checked={formData.overheating} onChange={handleInputChange} className="w-5 h-5" />
              <span className="font-bold">Engine Overheating</span>
            </label>
            <input type="text" name="sensorIssues" placeholder="Sensor Issues" value={formData.sensorIssues} onChange={handleInputChange} className="p-3 border rounded" />
          </div>
        )}

        {/* STEP 5: FINAL SUMMARY */}
        {step === 5 && (
          <div className="space-y-4">
            <select name="overallCondition" value={formData.overallCondition} onChange={handleInputChange} className="w-full p-3 border rounded font-bold">
              <option value="Good">Overall Condition: Good</option>
              <option value="Needs Attention">Overall Condition: Needs Attention</option>
              <option value="Critical">Overall Condition: Critical</option>
            </select>
            <textarea name="mainProblems" placeholder="Main Problems Identified" value={formData.mainProblems} onChange={handleInputChange} className="w-full p-3 border rounded h-24" />
            <textarea name="recommendedFixes" placeholder="Recommended Fixes" value={formData.recommendedFixes} onChange={handleInputChange} className="w-full p-3 border rounded h-24" />
            <textarea name="mechanicNotes" placeholder="Additional Mechanic Notes" value={formData.mechanicNotes} onChange={handleInputChange} className="w-full p-3 border rounded h-24" />
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="px-6 py-3 bg-slate-200 font-bold rounded hover:bg-slate-300">
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 5 ? (
            <button type="button" onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
              Next Step
            </button>
          ) : (
            <button type="submit" disabled={loading} className="px-8 py-3 bg-green-600 text-white font-extrabold rounded hover:bg-green-700">
              {loading ? "Submitting..." : "Submit Form"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GarageOfficerDashboard;
