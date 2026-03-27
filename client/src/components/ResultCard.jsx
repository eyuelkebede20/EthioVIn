import React, { useState, useEffect } from "react";

const ResultCard = ({ data }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!data) return;

    const fetchImage = async () => {
      try {
        const query = `${data.manufacturer} ${data.model} car`;
        const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json&origin=*`;

        const response = await fetch(url);
        const json = await response.json();
        const pages = json.query?.pages;

        if (pages) {
          const pageId = Object.keys(pages)[0];
          setImageUrl(pages[pageId].thumbnail?.source || null);
        } else {
          setImageUrl(null);
        }
      } catch (e) {
        console.error("Wikipedia Image Fetch Error:", e);
        setImageUrl(null);
      }
    };

    fetchImage();
  }, [data]);

  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden text-left w-full max-w-md">
      {/* Image Section */}
      <div className="w-full h-48 bg-slate-200 flex items-center justify-center overflow-hidden">
        {imageUrl ? <img src={imageUrl} alt={`${data.manufacturer} ${data.model}`} className="object-cover w-full h-full" /> : <span className="text-slate-400 font-bold">NO IMAGE AVAILABLE</span>}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full mb-2 tracking-wide uppercase">{data.body_type}</span>
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-2 ml-2 tracking-wide uppercase">{data.market_segment}</span>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {data.year} {data.manufacturer} {data.model}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1 font-bold tracking-widest">VIN: {data.vin}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase">AI Confidence</span>
            <span className={`text-sm font-extrabold ${data.confidence_score > 0.8 ? "text-green-500" : "text-yellow-500"}`}>{(data.confidence_score * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Engine</p>
            <p className="text-sm font-semibold text-slate-800">{data.engine_specs}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Capacity</p>
            <p className="text-sm font-semibold text-slate-800">{data.seating_capacity} Seats</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 p-4 text-center">
        <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Est. Ethiopian Market Price</p>
        <p className="text-white text-xl font-extrabold">{data.estimated_eth_price_range}</p>
      </div>
    </div>
  );
};

export default ResultCard;
