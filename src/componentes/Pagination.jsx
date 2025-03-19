import React from 'react';
import "./Pagination.css"

const Pagina= ({ currentPage, totalPages, onPreviousPage, onNextPage }) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination">
            <button onClick={onPreviousPage} disabled={currentPage === 1}>
            Anterior
            </button>
            <span className='pagination-text'>Página {currentPage} de {totalPages}</span>
            <button onClick={onNextPage} disabled={currentPage === totalPages}>
            Siguiente
            </button>
        </div>
    );
};

export default Pagina;