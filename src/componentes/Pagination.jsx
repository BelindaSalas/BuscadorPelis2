import React from 'react';

const Pagination = ({ currentPage, totalPages, onPreviousPage, onNextPage }) => {
  if (totalPages <= 1) return null;

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={onPreviousPage}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
        </li>
        <li className="page-item active">
          <span className="page-link">
            Página {currentPage} de {totalPages}
          </span>
        </li>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;