import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import AppRouter from './routers/AppRouter';
import InterestRouter from './routers/InterestRouter';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<AppRouter />, document.getElementById('root'));
ReactDOM.render(<InterestRouter />, document.getElementById('root'));
registerServiceWorker();
