import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource/vazirmatn/300.css';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/800.css';
import '@fontsource/vazirmatn/900.css';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { TextProvider } from './context/TextContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TextProvider>
        <App />
      </TextProvider>
    </ThemeProvider>
  </StrictMode>,
);

