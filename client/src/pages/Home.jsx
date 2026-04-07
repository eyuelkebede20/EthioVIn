import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegionToggle from '../components/RegionToggle';
import SearchBox from '../components/SearchBox';
import ResultCard from '../components/ResultCard';

const Home = () => {
  const [region, setRegion] = useState('asean');
  const [vin, setVin] = useState('');
  const [error, setError] = useState('');
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setVin('');
    setError('');
    setCarData(null);
  };

  const handleDecode = async () => {
    if (region === 'asean' && vin.length !== 17) {
      setError('ASEAN/Global VIN must be exactly 17 characters.');
      return;
    }
    if (region === 'japan' && !vin.includes('-')) {
      setError('Japan Chassis numbers usually require a hyphen.');
      return;
    }

    setLoading(true);
    setError('');
    setCarData(null);
    
    try {
      const token = sessionStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/vin/decode', {
        method: 'POST',
        headers,
        body: JSON.stringify({ vin, region })
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.requireSignup) {
           navigate('/register');
           throw new Error(data.error);
        }
        throw new Error(data.error || 'Failed to fetch data');
      }
      
      if (data.confidence_score < 0.4 || data.manufacturer.toLowerCase() === 'unknown') {
        setError('Could not confidently decode this VIN. Please check the number and try again.');
        setCarData(null);
      } else {
        setCarData(data);
        
        try {
          const existingHistory = JSON.parse(sessionStorage.getItem('vinHistory')) || [];
          const updatedHistory = [data, ...existingHistory.filter(item => item.vin !== data.vin)];
          sessionStorage.setItem('vinHistory', JSON.stringify(updatedHistory));
        } catch (e) {
          sessionStorage.setItem('vinHistory', JSON.stringify([data]));
        }
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white pt-20 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6">Unlock Your Vehicle's History with EthioVin</h1>
          <p className="text-xl text-blue-200 mb-10">
            Enter your VIN or Chassis Number to get comprehensive technical specifications, maintenance history, and estimated Ethiopian market valuations instantly.
          </p>
          
          <div className="bg-white p-6 rounded-xl shadow-2xl text-slate-900 max-w-3xl mx-auto">
            <RegionToggle region={region} onRegionChange={handleRegionChange} />
            <div className="mt-4">
              <SearchBox 
                region={region} 
                vin={vin} 
                setVin={setVin} 
                error={error} 
                setError={setError} 
                onDecode={handleDecode} 
              />
            </div>
            {loading && <p className="mt-4 text-blue-600 font-bold">Decoding and retrieving history...</p>}
            {error && <p className="mt-4 text-red-500 font-bold">{error}</p>}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {carData && (
        <section className="max-w-5xl mx-auto mt-12 px-6">
          <ResultCard data={carData} />
        </section>
      )}

      {/* Features Section */}
      {!carData && (
        <section className="max-w-6xl mx-auto mt-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
            <h3 className="text-xl font-bold mb-3">Technical Specifications</h3>
            <p className="text-slate-600">Access exact engine details, transmission type, body specifications, and manufacturing data directly from global databases.</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
            <h3 className="text-xl font-bold mb-3">Maintenance & Insurance Records</h3>
            <p className="text-slate-600">Check for registered accidents, critical repairs, and maintenance history logged by local Ethiopian garages and insurers.</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
            <h3 className="text-xl font-bold mb-3">Market Valuation</h3>
            <p className="text-slate-600">Get AI-driven price estimates in ETB tailored to the Ethiopian import market, factoring in duties and current trends.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;