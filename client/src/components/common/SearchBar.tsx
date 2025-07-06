import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useStore } from '../../store/useStore';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, searchProducts, products } = useStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = products
        .filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setFilteredProducts(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchProducts(searchQuery);
      setShowSuggestions(false);
      navigate('/');
    }
  };

  const handleSuggestionClick = (product: any) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex w-full">
        <select className="bg-gray-200 text-gray-900 px-2 sm:px-3 py-2 rounded-l-md border-r border-gray-300 text-xs sm:text-sm hidden sm:block">
          <option>All Departments</option>
          <option>Green Store</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home & Kitchen</option>
          <option>Books</option>
        </select>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
            placeholder="Search Amazon Green for eco-friendly products..."
            className="w-full px-3 sm:px-4 py-2 text-gray-900 focus:outline-none text-sm sm:text-base"
          />
          
          {/* Search Suggestions */}
          {showSuggestions && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg z-50 max-h-80 overflow-y-auto">
              {filteredProducts.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <img
                      src={product.url || 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=50'}
                      alt={product.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=50';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-600">{product.price}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 px-3 sm:px-4 py-2 rounded-r-md flex items-center justify-center transition-colors"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;