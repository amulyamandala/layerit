import  { useState, useEffect } from 'react';
import { Heart, Sparkles, ShoppingBag, Home, ArrowRight, Star, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Quiz from './components/Quiz';
import Results from './components/Results';
import ProductCard from './components/ProductCard';
import productsData from './data/products.json';

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  ingredients: string[];
  skinTypes: string[];
}

interface ConflictRule {
  ingredientA: string;
  ingredientB: string;
  severity: 'safe' | 'caution' | 'danger';
  explanation: string;
}

interface CompatibilityResult {
  verdict: 'safe' | 'caution' | 'danger';
  conflicts: ConflictRule[];
  message: string;
}

const CONFLICT_RULES: ConflictRule[] = [
  {
    ingredientA: 'retinol',
    ingredientB: 'vitamin c',
    severity: 'caution',
    explanation: 'Retinol and Vitamin C can be irritating when used together. Use one in AM, one in PM.'
  },
  {
    ingredientA: 'retinol',
    ingredientB: 'aha',
    severity: 'danger',
    explanation: 'Retinol and AHAs can cause severe irritation and damage the skin barrier. Do not use together.'
  },
  {
    ingredientA: 'retinol',
    ingredientB: 'bha',
    severity: 'danger',
    explanation: 'Retinol and BHA can over-exfoliate and cause redness. Separate by at least 24 hours.'
  },
  {
    ingredientA: 'retinol',
    ingredientB: 'benzoyl peroxide',
    severity: 'danger',
    explanation: 'Benzoyl peroxide can oxidize retinol, making both ingredients ineffective and irritating.'
  },
  {
    ingredientA: 'vitamin c',
    ingredientB: 'niacinamide',
    severity: 'caution',
    explanation: 'Older formulations may cause flushing. Modern formulations are generally safe, but monitor for redness.'
  },
  {
    ingredientA: 'vitamin c',
    ingredientB: 'aha',
    severity: 'caution',
    explanation: 'Both are acidic and may cause irritation. Use at different times of day if sensitive.'
  },
  {
    ingredientA: 'aha',
    ingredientB: 'bha',
    severity: 'caution',
    explanation: 'Using multiple exfoliants together can over-exfoliate. Start slowly and monitor skin response.'
  },
  {
    ingredientA: 'benzoyl peroxide',
    ingredientB: 'vitamin c',
    severity: 'danger',
    explanation: 'Benzoyl peroxide oxidizes Vitamin C, reducing effectiveness of both. Use separately.'
  },
  {
    ingredientA: 'retinol',
    ingredientB: 'peptides',
    severity: 'caution',
    explanation: 'Retinol can break down peptides. Use peptides in AM and retinol in PM for best results.'
  }
];

const checkCompatibility = (productA: Product, productB: Product): CompatibilityResult => {
  const conflicts: ConflictRule[] = [];
  
  for (const ingA of productA.ingredients) {
    for (const ingB of productB.ingredients) {
      for (const rule of CONFLICT_RULES) {
        if (
          (ingA.toLowerCase() === rule.ingredientA && ingB.toLowerCase() === rule.ingredientB) ||
          (ingA.toLowerCase() === rule.ingredientB && ingB.toLowerCase() === rule.ingredientA)
        ) {
          conflicts.push(rule);
        }
      }
    }
  }

  if (conflicts.length === 0) {
    return { verdict: 'safe', conflicts: [], message: 'These products are safe to use together!' };
  }

  const hasDanger = conflicts.some(c => c.severity === 'danger');
  const hasCaution = conflicts.some(c => c.severity === 'caution');

  if (hasDanger) {
    return { verdict: 'danger', conflicts, message: 'Do not use these products together.' };
  }

  if (hasCaution) {
    return { verdict: 'caution', conflicts, message: 'Use with caution. Consider separating AM/PM.' };
  }

  return { verdict: 'safe', conflicts: [], message: 'These products are safe to use together!' };
};

const VerdictIcon = ({ verdict }: { verdict: string }) => {
  if (verdict === 'safe') return <CheckCircle className="w-16 h-16 text-emerald-500" />;
  if (verdict === 'caution') return <AlertTriangle className="w-16 h-16 text-amber-500" />;
  return <XCircle className="w-16 h-16 text-rose-500" />;
};

const App = () => {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'results' | 'products' | 'routine'>('home');
  const [skinType, setSkinType] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [comparisonResult, setComparisonResult] = useState<CompatibilityResult | null>(null);
  const [savedRoutine, setSavedRoutine] = useState<Product[]>([]);

  const products: Product[] = productsData;

  useEffect(() => {
    const saved = localStorage.getItem('layerit_routine');
    if (saved) {
      const routineIds = JSON.parse(saved);
      const routine = products.filter(p => routineIds.includes(p.id));
      setSavedRoutine(routine);
    }
    
    const savedSkinType = localStorage.getItem('layerit_skin_type');
    if (savedSkinType) {
      setSkinType(savedSkinType);
    }
  }, []);

  const handleCompare = () => {
    if (selectedProducts.length === 2) {
      const result = checkCompatibility(selectedProducts[0], selectedProducts[1]);
      setComparisonResult(result);
    }
  };

  const handleAddToRoutine = (product: Product) => {
    const newRoutine = [...savedRoutine, product];
    setSavedRoutine(newRoutine);
    localStorage.setItem('layerit_routine', JSON.stringify(newRoutine.map(p => p.id)));
  };

  if (currentView === 'quiz') {
    return (
      <Quiz
        onComplete={(type) => {
          setSkinType(type);
          localStorage.setItem('layerit_skin_type', type);
          setCurrentView('results');
        }}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'results') {
    return (
      <Results
        skinType={skinType}
        onBrowseProducts={() => setCurrentView('products')}
        onBackHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'products') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Product Collection</h2>
            <p className="text-gray-600 font-light">Discover and compare skincare products</p>
          </div>

          {selectedProducts.length > 0 && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 mb-6 border-2 border-purple-200/50 shadow-lg">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <span>🔍</span>
                Selected for Comparison
              </h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedProducts.map(p => (
                  <div key={p.id} className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-md border border-purple-200">
                    {p.name}
                  </div>
                ))}
              </div>
              {selectedProducts.length === 2 && (
                <button
                  onClick={handleCompare}
                  className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  ✨ Check Compatibility
                </button>
              )}
            </div>
          )}

          {comparisonResult && (
            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6 border-2 border-pink-100">
              <div className="text-center mb-6">
                <VerdictIcon verdict={comparisonResult.verdict} />
                <h3 className="text-3xl font-bold mt-4 capitalize">{comparisonResult.verdict}</h3>
                <p className="text-gray-600 mt-2 text-lg font-light">{comparisonResult.message}</p>
              </div>

              {comparisonResult.conflicts.length > 0 && (
                <div className="border-t-2 border-dashed border-gray-200 pt-6 mt-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-lg">
                    <span>⚗️</span>
                    Ingredient Interactions
                  </h4>
                  {comparisonResult.conflicts.map((conflict, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5 mb-3 border-2 border-yellow-200">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="capitalize font-semibold text-gray-800">{conflict.ingredientA}</span>
                        <span className="text-gray-400">+</span>
                        <span className="capitalize font-semibold text-gray-800">{conflict.ingredientB}</span>
                        <span className={`ml-auto text-xs px-3 py-1 rounded-full font-bold ${
                          conflict.severity === 'danger' 
                            ? 'bg-rose-200 text-rose-800' 
                            : 'bg-amber-200 text-amber-800'
                        }`}>
                          {conflict.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-light">{conflict.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setComparisonResult(null);
                  setSelectedProducts([]);
                }}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                Compare Different Products
              </button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.some(p => p.id === product.id)}
                isInRoutine={savedRoutine.some(p => p.id === product.id)}
                canSelect={selectedProducts.length < 2 || selectedProducts.some(p => p.id === product.id)}
                onSelect={() => {
                  if (selectedProducts.find(p => p.id === product.id)) {
                    setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
                  } else if (selectedProducts.length < 2) {
                    setSelectedProducts([...selectedProducts, product]);
                  }
                }}
                onAddToRoutine={() => handleAddToRoutine(product)}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="mt-8 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 mx-auto"
          >
            <Home className="w-4 h-4" />
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        h1, h2, h3 { font-family: 'Playfair Display', serif; }
      `}</style>
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
            <Sparkles className="w-8 h-8 text-pink-400" />
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              LayerIt
            </h1>
            <Heart className="w-8 h-8 text-pink-400" />
          </div>
          <p className="text-gray-600 text-lg font-light">your friendly skincare compatibility checker</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setCurrentView('quiz')}
            className="group bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-pink-200/50"
          >
            <div className="bg-white/80 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
              <Sparkles className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Find Your Skin Type</h3>
            <p className="text-gray-600 font-light mb-4">Take a quick 5-question quiz to discover your unique skin type</p>
            <div className="flex items-center justify-center gap-2 text-pink-500 font-medium">
              <span>Start Quiz</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => setCurrentView('products')}
            className="group bg-gradient-to-br from-purple-100 to-purple-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-purple-200/50"
          >
            <div className="bg-white/80 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Browse Products</h3>
            <p className="text-gray-600 font-light mb-4">Check compatibility & build your perfect skincare routine</p>
            <div className="flex items-center justify-center gap-2 text-purple-500 font-medium">
              <span>Explore Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {savedRoutine.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl p-6 shadow-lg border-2 border-indigo-200/50">
            <div className="flex items-center gap-4">
              <div className="bg-white/80 w-16 h-16 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Your Saved Routine</h3>
                <p className="text-gray-600 font-light">{savedRoutine.length} products · Looking good!</p>
              </div>
              <button
                onClick={() => setCurrentView('routine')}
                className="bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition-colors shadow-md"
              >
                View Routine
              </button>
            </div>
          </div>
        )}

        {skinType && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border-2 border-pink-200">
              <span className="text-gray-600">Your skin type:</span>
              <span className="capitalize font-bold text-pink-500">{skinType}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;