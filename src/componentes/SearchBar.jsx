import React, { useState } from "react";
import axios from "axios";
import "./SearchBar.css"; // Archivo de estilos

const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_KEY = "57842c3cfdbdb9704c062d73aae1ae46"; // Reemplaza con tu API key

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
    <div className="search-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar película..."
        value={query}
        onChange={handleInputChange}
      />
      <div className="results-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            
            <img
                src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"}
                alt={movie.title || "Imagen no disponible"}
                className="movie-poster"
            />

            <p className="movie-title">{movie.title}</p>
        </div>
        ))}
    </div>
    </div>
);
};

export default SearchBar;
