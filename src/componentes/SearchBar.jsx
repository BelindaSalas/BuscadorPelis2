import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagina from './Pagination.jsx'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const API_KEY = '57842c3cfdbdb9704c062d73aae1ae46';
const BASE_URL = 'https://api.themoviedb.org/3';

const MovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
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
      setMovies([]);
      setTotalPages(1);
      setError('');
      return;
    }

    if (!isValidSearchTerm(searchTerm)) {
      setError('No se permiten caracteres especiales ni espacios solos.');
      setMovies([]);
      setTotalPages(1);
      return;
    }

    setError('');

    const isGenreSearch = genres.some(genre => genre.name.toLowerCase() === searchTerm.toLowerCase());
    const isArtistSearch = searchTerm.toLowerCase().startsWith('artista ');

    let url = `${BASE_URL}/search/movie`;
    let params = {
      api_key: API_KEY,
      language: 'es-ES',
      query: searchTerm,
      page: currentPage
    };

    if (isGenreSearch) {
      const genreId = genres.find(genre => genre.name.toLowerCase() === searchTerm.toLowerCase())?.id;
      if (genreId) {
        url = `${BASE_URL}/discover/movie`;
        params.with_genres = genreId;
        delete params.query;
      }
    }

    if (isArtistSearch) {
      const artistName = searchTerm.replace('artista ', '').trim();
      url = `${BASE_URL}/search/person`;
      params.query = artistName;
    }

    axios.get(url, { params })
      .then(response => {
        if (isArtistSearch) {
          const allMoviesByArtists = response.data.results.flatMap(person => person.known_for || []);
          setMovies(allMoviesByArtists);
          setTotalPages(1);
        } else {
          setMovies(response.data.results);
          setTotalPages(response.data.total_pages);
        }
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, [searchTerm, genres, currentPage]);

  const fetchMovieCredits = async (movieId) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
        params: {
          api_key: API_KEY
        }
      });
      return response.data.cast.slice(0, 5).map(actor => actor.original_name);
    } catch (error) {
      console.error('Error fetching credits:', error);
      return [];
    }
  };

  const isValidSearchTerm = (term) => {
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
    return regex.test(term.trim());
  };

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

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (isValidSearchTerm(value) || value === '') {
      setSearchTerm(value);
      setCurrentPage(1);
      setError('');
    } else {
      setError('No se permiten caracteres especiales ni espacios solos.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por título, género o artista:artista..."
            value={searchTerm}
            onChange={handleInputChange}
          />
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </div>
      <div className="row mt-4">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">
                  {movie.overview ? movie.overview.slice(0, 100) + '...' : 'Descripción no disponible.'}
                </p>
                <p className="card-text">
                  <small className="text-muted">
                    Reparto: <MovieCast movieId={movie.id} fetchMovieCredits={fetchMovieCredits} />
                  </small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6 text-center">
          <Pagina
            currentPage={currentPage}
            totalPages={totalPages}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </div>
      </div>
    </div>
  );
};

const MovieCast = ({ movieId, fetchMovieCredits }) => {
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const getCast = async () => {
      const credits = await fetchMovieCredits(movieId);
      setCast(credits);
    };
    getCast();
  }, [movieId, fetchMovieCredits]);

  return (
    <span>
      {cast.length > 0 ? cast.join(', ') : 'Cargando reparto...'}
    </span>
  );
};

export default MovieSearch;