'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterByType: (type: string) => void;
  onFilterByDate: (startDate: string, endDate: string) => void;
  recordTypes: string[];
}

export function SearchFilters({
  onSearch,
  onFilterByType,
  onFilterByDate,
  recordTypes,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
    onFilterByType(type);
  };

  const handleDateFilter = () => {
    onFilterByDate(startDate, endDate);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setStartDate('');
    setEndDate('');
    onSearch('');
    onFilterByType('');
    onFilterByDate('', '');
  };

  const activeFilterCount = [
    searchQuery ? 1 : 0,
    selectedType ? 1 : 0,
    startDate || endDate ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search records by name, type, or date..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex gap-2">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          {/* Type Filter */}
          {recordTypes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Record Type
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTypeFilter('')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedType === ''
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                {recordTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeFilter(type)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedType === type
                        ? 'bg-primary text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Date Range
            </label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-600">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                onClick={handleDateFilter}
                className="bg-primary hover:bg-primary/90 text-white"
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
