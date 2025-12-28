import React from 'react';

interface ResultsProps {
  skinType: string;
  onBrowseProducts: () => void;
  onBackHome: () => void;
}

const ROUTINES: { [key: string]: string[] } = {
  oily: ['Gentle cleanser', 'BHA toner or serum', 'Lightweight moisturizer', 'Niacinamide serum (optional)'],
  dry: ['Creamy cleanser', 'Hydrating toner', 'Rich moisturizer', 'Facial oil (optional)'],
  combination: ['Gentle cleanser', 'Balancing toner', 'Gel moisturizer', 'Spot treatment for T-zone'],
  sensitive: ['Fragrance-free cleanser', 'Soothing toner', 'Barrier repair cream', 'Avoid actives initially'],
  normal: ['Gentle cleanser', 'Hydrating toner', 'Light moisturizer', 'Optional targeted treatments']
};

const Results: React.FC<ResultsProps> = ({ skinType, onBrowseProducts, onBackHome }) => {
  const routine = ROUTINES[skinType] || ROUTINES.normal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-pink-100 mb-6">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">✨</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Your Skin Type</h2>
            <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 px-8 py-4 rounded-full mt-4 border-2 border-pink-200">
              <p className="text-5xl font-bold capitalize bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {skinType}
              </p>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-200 pt-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>🌸</span>
              Your Personalized Routine
            </h3>
            <div className="space-y-4">
              {routine.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl border border-pink-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 font-medium pt-2">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBrowseProducts}
            className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 px-6 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105"
          >
            Browse Products
          </button>
          <button
            onClick={onBackHome}
            className="flex-1 bg-white text-gray-700 py-4 px-6 rounded-full font-semibold hover:shadow-lg transition-all border-2 border-gray-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;