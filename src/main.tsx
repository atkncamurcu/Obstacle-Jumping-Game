import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Space tuşu ile scroll'u engelleme - global event listener
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    return false;
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
