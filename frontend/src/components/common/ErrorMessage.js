import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry, type = 'error' }) => {
  return (
    <div className={`error-message ${type}`}>
      <div className="error-content">
        <div className="error-icon">
          {type === 'error' ? '⚠️' : type === 'warning' ? '⚡' : 'ℹ️'}
        </div>
        <div className="error-text">
          <h3>{type === 'error' ? 'Something went wrong' : type === 'warning' ? 'Warning' : 'Information'}</h3>
          <p>{message}</p>
        </div>
        {onRetry && (
          <button className="retry-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;