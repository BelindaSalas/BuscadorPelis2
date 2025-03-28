import React, { useCallback } from "react";
import SearchBar from "./componentes/SearchBar";
import "./App.css";

function App() {
  const handleSearchState = useCallback((hasResults, hasError, hasSearchTerm) => {
    console.log('Estado de búsqueda:', { hasResults, hasError, hasSearchTerm });
  }, []);

  return (
    <div className="App">
      <header className="App-header bg-dark text-white py-5">
        <div className="container">
          <h1 className="display-4 mb-3">🍿 Buscador de Películas</h1>
          <p className="lead">Encuentra tu película favorita</p>
          <SearchBar onSearchState={handleSearchState} />
        </div>
      </header>
    </div>
  );
}

export default App;