import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function SearchBarCards({ onSearchTermChange, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('all');

  useEffect(() => {
    onSearchTermChange(searchTerm);
  }, [searchTerm, onSearchTermChange]);

  useEffect(() => {
    onFilterChange(searchBy);
  }, [searchBy, onFilterChange]);

  const handleSearchTermChange = (event) => setSearchTerm(event.target.value);
  const handleSearchByChange = (event) => setSearchBy(event.target.value);
  const handleSubmit = (event) => event.preventDefault();

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card-dark search-bar-cards"
    >
      <select
        value={searchBy}
        onChange={handleSearchByChange}
        className="glass-input"
        style={{ minWidth: '160px' }}
      >
        <option value="all">All Cards</option>
        <option value="conceptual">Conceptual Cards</option>
        <option value="procedural">Procedural Cards</option>
      </select>
      <input
        type="text"
        placeholder="Search cards..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="glass-input"
        style={{ flex: 1 }}
      />
    </form>
  );
}

SearchBarCards.propTypes = {
  onSearchTermChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default SearchBarCards;
