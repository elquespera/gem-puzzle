import './styles/style.scss';
import App from './components/App';

import header from './components/Header';
import main from './components/Main';
import settings from './components/Settings';
import footer from './components/Footer';
import Puzzle from './services/Puzzle';

const bootstrap = () => {
  App(header, main, settings, footer);
  Puzzle(header, main, settings);
};

bootstrap();
