import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-theme-bootstrap/dist/all.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
