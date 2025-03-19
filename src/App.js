import React, { useState } from "react";
import SearchBar from "./componentes/SearchBar";
import "./App.css"; 

function App() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍿 Buscador de Películas</h1>
        <p>Encuentra tu película favorita</p>

        {/* Barra de búsqueda */}
        <SearchBar onResults={setSearchResults} />
      </header>
    </div>
  );
}

export default App;
