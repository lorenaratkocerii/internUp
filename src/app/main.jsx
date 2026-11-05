import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/instrument-sans/wght.css';
import '../index.css';
import { createContainer } from '../infrastructure/container';
import { App } from './App';

const container = createContainer();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App container={container} />
    </BrowserRouter>
  </StrictMode>,
);
