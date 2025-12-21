import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './app/store';
import { loadInitialSession } from './features/auth';
import ToggleColorMode from './utils/ToggleColorMode';
import App from './components/App';

import './index.css';

// Initialize auth from localStorage before rendering to avoid route flicker
store.dispatch(loadInitialSession());

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ToggleColorMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToggleColorMode>
  </Provider>
);