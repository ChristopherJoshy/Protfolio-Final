import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './components/theme-provider';
import './styles/theme.css';  // Import our theme styles
import 'remixicon/fonts/remixicon.css';  // Import Remix Icon CSS

const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  })();
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
