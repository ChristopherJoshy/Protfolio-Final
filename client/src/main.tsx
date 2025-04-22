import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/theme.css';
import 'remixicon/fonts/remixicon.css';

const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    } catch (e) {
      console.log('Failed to set initial theme');
    }
  })();
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    <App />
  </React.StrictMode>
);
