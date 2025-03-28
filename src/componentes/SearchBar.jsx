import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_KEY = '57842c3cfdbdb9704c062d73aae1ae46';
const BASE_URL = 'https://api.themoviedb.org/3';

const SearchBar = ({ onSearchState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${BASE_URL}/genre/movie/list`, {
      params: { api_key: API_KEY, language: 'es-ES' }
    })
    .then(response => setGenres(response.data.genres))
    .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setMovies([]);
      setTotalPages(1);
      setError('');
      onSearchState(false, false, false);
      return;
    }

    if (!isValidSearchTerm(searchTerm)) {
      setError('Solo se permiten letras, números y espacios');
      setMovies([]);
      setTotalPages(1);
      onSearchState(false, true, true);
      return;
    }

    setError('');
    const isGenreSearch = genres.some(g => g.name.toLowerCase() === searchTerm.toLowerCase());
    const isArtistSearch = searchTerm.toLowerCase().startsWith('artista ');

    let url = `${BASE_URL}/search/movie`;
    let params = {
      api_key: API_KEY,
      language: 'es-ES',
      query: searchTerm,
      page: currentPage
    };

    if (isGenreSearch) {
      const genreId = genres.find(g => g.name.toLowerCase() === searchTerm.toLowerCase())?.id;
      if (genreId) {
        url = `${BASE_URL}/discover/movie`;
        params.with_genres = genreId;
        delete params.query;
      }
    }

    if (isArtistSearch) {
      url = `${BASE_URL}/search/person`;
      params.query = searchTerm.replace('artista ', '').trim();
    }

    axios.get(url, { params })
      .then(response => {
        const results = isArtistSearch 
          ? response.data.results.flatMap(p => p.known_for || []) 
          : response.data.results;
        
        setMovies(results);
        setTotalPages(isArtistSearch ? 1 : response.data.total_pages);
        onSearchState(results.length > 0, false, true);
      })
      .catch(error => {
        console.error('Error:', error);
        onSearchState(false, true, true);
      });
  }, [searchTerm, genres, currentPage, onSearchState]);

  const isValidSearchTerm = (term) => /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/.test(term.trim());

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (isValidSearchTerm(value) || value === '') {
      setSearchTerm(value);
      setCurrentPage(1);
      setError('');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Buscar por título, género o 'artista nombre'..."
            value={searchTerm}
            onChange={handleInputChange}
          />
          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </div>
      </div>

      {movies.length === 0 && searchTerm.trim() !== '' && !error && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="alert alert-info text-center">
              No se encontraron resultados para "{searchTerm}"
            </div>
          </div>
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
        {movies.map(movie => (
          <div key={movie.id} className="col">
            <div className="card h-100 shadow-sm">
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : '/placeholder-movie.png'}
                className="card-img-top"
                alt={movie.title}
                style={{ height: '450px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text text-muted">
                  {movie.overview?.slice(0, 120) || 'Descripción no disponible'}...
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {movies.length > 0 && totalPages > 1 && (
        <div className="row justify-content-center mt-4">
          <div className="col-md-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPreviousPage={() => setCurrentPage(p => Math.max(1, p - 1))}
              onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;