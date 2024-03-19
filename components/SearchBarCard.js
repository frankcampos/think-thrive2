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

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'black', padding: '20px', borderRadius: '10px',
      }}
    >
      <select
        value={searchBy}
        onChange={handleSearchByChange}
        style={{
          marginRight: '10px', backgroundColor: '#555', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px',
        }}
      >
        <option value="procedural">Procedural Cards</option>
        <option value="conceptual">Conceptual Cards</option>
        <option value="all">All Cards</option>
      </select>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        style={{
          flex: 1, backgroundColor: '#555', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px',
        }}
      />
    </form>
  );
}

SearchBarCards.propTypes = {
  onSearchTermChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default SearchBarCards;
