// src/components/SearchBar.tsx
"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface Suggestion {
  type: 'product' | 'category';
  name: string;
  slug: string;
}

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(term)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to load suggestions');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim());
    }
  };

  const performSearch = (term: string) => {
    router.push(`/list?name=${encodeURIComponent(term)}`);
    setShowSuggestions(false);
    // Save to recent searches
    saveToRecentSearches(term);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'product') {
      router.push(`/${suggestion.slug}`);
    } else {
      router.push(`/list?cat=${suggestion.slug}`);
    }
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchTerm.length > 1 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
    loadRecentSearches();
  };

  // Recent searches functionality
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const loadRecentSearches = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  };

  const saveToRecentSearches = (term: string) => {
    const updated = [term, ...recentSearches.filter(item => item !== term)].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  };

  return (
    <div className="relative flex-1" ref={searchRef}>
      <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
        <div className="flex items-center flex-1">
          <Search className="text-gray-500 ml-2" size={18} />
          <input
            type="text"
            name="name"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search brands, products, categories..."
            className="flex-1 bg-transparent outline-none px-2 py-1"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!searchTerm.trim()}
        >
          <Search size={18} />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
              <p>Searching...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="p-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-600 px-2">Suggestions</h3>
              </div>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <Search size={16} className="text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{suggestion.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : searchTerm.length > 1 ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{searchTerm}"
            </div>
          ) : null}
        </div>
      )}

      {/* Recent searches */}
      {showSuggestions && searchTerm.length === 0 && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-sm">Recent Searches</h3>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          </div>
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm(search);
                    performSearch(search);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Search size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="text-sm">{search}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default SearchBar;