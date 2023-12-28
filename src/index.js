import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// const catalyst = require('zcatalyst-sdk-node');
// module.exports = (cronDetails, context) => 
// {
//   const app = catalyst.initialize(context);
// //This app variable is used to access the catalyst components.
// //You can refer the SDK docs for code samples.
// //Your business logic comes here
// }