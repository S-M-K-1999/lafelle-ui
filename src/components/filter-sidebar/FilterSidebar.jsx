import React, { useEffect, useState } from "react";
import "./FilterSidebar.scss";

const priceRanges = [
  { label: "₹0 - ₹10", min: 0, max: 10 },
  { label: "₹10 - ₹100", min: 10, max: 100 },
  { label: "₹100 - ₹500", min: 100, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000+", min: 1000, max: Infinity }
];

const FilterSidebar = ({ products, onFilterChange }) => {
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRanges, setSelectedRanges] = useState([]);

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  const handleCategoryChange = (cat) => {
    setCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleRangeChange = (range) => {
    setSelectedRanges((prev) =>
      prev.includes(range)
        ? prev.filter((r) => r !== range)
        : [...prev, range]
    );
  };

  useEffect(() => {
    onFilterChange({ category, priceRanges: selectedRanges, search });
  }, [category, selectedRanges, search, onFilterChange]);

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>

      {/* Search */}
      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          id="search"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="filter-group">
        <label>Category</label>
        {uniqueCategories.map((cat) => (
          <div key={cat} className="checkbox-item">
            <input
              type="checkbox"
              id={`cat-${cat}`}
              checked={category.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />
            <label htmlFor={`cat-${cat}`}>{cat}</label>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <label>Price Range</label>
        {priceRanges.map((range) => (
          <div key={range.label} className="checkbox-item">
            <input
              type="checkbox"
              id={`range-${range.label}`}
              checked={selectedRanges.includes(range)}
              onChange={() => handleRangeChange(range)}
            />
            <label htmlFor={`range-${range.label}`}>{range.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
