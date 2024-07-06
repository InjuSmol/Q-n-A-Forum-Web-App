import React, { useState, useEffect } from 'react';

const SearchResults = ({ searchQuery }) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        console.log('Search triggered -- in searchresults');
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`http://localhost:8000/search?q=${searchQuery}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    return (
        <div id="search-page">
            <h2>Search Results:</h2>
            {results.length === 0 ? (
                <p>No matching questions found.</p>
            ) : (
                <ul>
                    {results.map((question) => (
                        <li key={question._id}>
                            <div>
                                <strong>Title:</strong> {question.title} <br />
                                <strong>Text:</strong> {question.text} <br />
                                <strong>Tags:</strong> {question.tags ? question.tags.map((tag) => tag.name).join(', ') : 'No tags'} <br />
                            </div>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
