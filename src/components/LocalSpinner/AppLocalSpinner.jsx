import React from 'react';
import './appLocalSpinner.css';

/**
 * Componente de Spinner Local para cargas parciales (dentro de secciones o componentes).
 * * @param {string} message - Mensaje opcional a mostrar debajo del spinner.
 */
const AppLocalSpinner = ({ message = "Cargando datos..." }) => {
    return (
        <div className="local-spinner-container">
            <div className="local-spinner-content">
                <div className="local-spinner"></div>
                
                <p className="local-spinner-text">{message}</p>
            </div>
        </div>
    );
};

export default AppLocalSpinner;