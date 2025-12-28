import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  ingredients: string[];
  skinTypes: string[];
}

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  isInRoutine: boolean;
  canSelect: boolean;
  onSelect: () => void;
  onAddToRoutine: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  isInRoutine,
  canSelect,
  onSelect,
  onAddToRoutine
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100">
      <div className="mb-4">
        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
        <p className="text-sm text-pink-500 font-medium">{product.brand}</p>
      </div>

      <p className="text-sm text-gray-600 mb-4 font-light leading-relaxed">{product.description}</p>
      
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
          <span>🧪</span>
          Key Ingredients
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {product.ingredients.slice(0, 4).join(', ')}
          {product.ingredients.length > 4 && '...'}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSelect}
          disabled={!canSelect && !isSelected}
          className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
            isSelected
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md'
              : canSelect
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSelected ? '✓ Selected' : 'Select'}
        </button>
        
        <button
          onClick={onAddToRoutine}
          disabled={isInRoutine}
          className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
            isInRoutine
              ? 'bg-emerald-200 text-emerald-800'
              : 'bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:shadow-lg'
          }`}
          title={isInRoutine ? 'In routine' : 'Add to routine'}
        >
          {isInRoutine ? '✓' : <ShoppingBag size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;