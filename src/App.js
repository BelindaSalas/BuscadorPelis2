import React, { useState } from "react";
import SearchBar from "./componentes/SearchBar";
import "./App.css"; 


function App() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hola</h1>
        
        <p>¡Busca tu pelicula favorita !</p>
        
        {/* Barra de búsqueda */}
        <SearchBar onResults={setSearchResults} />

        {/* Resultados de la búsqueda */}
        <h1>Resultados:</h1>
        <ul>
          {searchResults.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
