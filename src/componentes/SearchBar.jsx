import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./SearchBar.css"
import Pagina from './Pagination.jsx'; 

const API_KEY = '57842c3cfdbdb9704c062d73aae1ae46';
const BASE_URL = 'https://api.themoviedb.org/3';

const MovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Obtener la lista de géneros
    axios.get(`${BASE_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES'
      }
    })
    .then(response => {
      setGenres(response.data.genres);
    })
    .catch(error => {
      console.error('Error fetching genres:', error);
    });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setMovies([]); // Limpiar resultados si no hay término de búsqueda
      setTotalPages(1);
      return;
    }

    // Determinar si la búsqueda es por género, artista o título
    const isGenreSearch = genres.some(genre => genre.name.toLowerCase() === searchTerm.toLowerCase());
    const isArtistSearch = searchTerm.toLowerCase().startsWith('artista:');

    let url = `${BASE_URL}/search/movie`;
    let params = {
      api_key: API_KEY,
      language: 'es-ES',
      query: searchTerm,
      page: currentPage // Agregar el número de página a la solicitud
    };

    if (isGenreSearch) {
      const genreId = genres.find(genre => genre.name.toLowerCase() === searchTerm.toLowerCase())?.id;
      if (genreId) {
        url = `${BASE_URL}/discover/movie`;
        params.with_genres = genreId;
        delete params.query; // Eliminar el parámetro de búsqueda por título
      }
    }

    if (isArtistSearch) {
      const artistName = searchTerm.replace('artista:', '').trim();
      url = `${BASE_URL}/search/person`;
      params.query = artistName;
    }

    // Realizar la búsqueda
    axios.get(url, { params })
      .then(response => {
        if (isArtistSearch) {
          // Si se busca por artista, obtener todas las películas en las que ha participado
          const allMoviesByArtists = response.data.results.flatMap(person => person.known_for || []);
          setMovies(allMoviesByArtists);
          setTotalPages(1); // No hay paginación para búsquedas de artistas
        } else {
          setMovies(response.data.results);
          setTotalPages(response.data.total_pages); // Establecer el número total de páginas
        }
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, [searchTerm, genres, currentPage]); // Dependencia agregada: currentPage

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar por título, género o artista:artista..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reiniciar a la primera página al cambiar el término de búsqueda
        }}
      />
      <div className="results-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-description">
              {movie.overview ? movie.overview.slice(0, 100) + '...' : 'Descripción no disponible.'}
            </p>
          </div>
        ))}
      </div>
      {/* Componente de paginación */}
      <Pagina
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default MovieSearch;