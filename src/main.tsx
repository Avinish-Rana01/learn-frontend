import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './lib/theme';
import App from './App';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
