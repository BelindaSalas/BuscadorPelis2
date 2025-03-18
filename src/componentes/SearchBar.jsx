import React, { useState } from "react";
import axios from "axios";


const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_KEY = "TU_API_KEY"; /* ALAN en esta parte va air la api que te genere la plataforma*/ 

const SearchBar = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const fetchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(API_URL, {
        params: { api_key: API_KEY, query: searchQuery },
      });
      setMovies(response.data.results);
      onResults(response.data.results); // Enviar resultados al padre
    } catch (error) {
      console.error("Error al buscar películas:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchMovies(value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar película..."
        value={query}
        onChange={handleInputChange}
      />
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
