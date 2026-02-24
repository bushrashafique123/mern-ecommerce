import React from 'react';
import './boxLoader.css';

const BoxLoader = ({ message = 'Loading...', size = 12, color = '#4f46e5' }) => {
  return (
    <div className="box-loader-wrapper">
      <div className="box-loader">
        <span style={{ backgroundColor: color, width: size, height: size }}></span>
        <span style={{ backgroundColor: color, width: size, height: size }}></span>
        <span style={{ backgroundColor: color, width: size, height: size }}></span>
      </div>
      <p className="box-loader-message">{message}</p>
    </div>
  );
};

export default BoxLoader;