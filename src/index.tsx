import { StrictMode } from 'react';
import { render } from 'react-dom';

import App from './pages/App';

import './style.css';

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
