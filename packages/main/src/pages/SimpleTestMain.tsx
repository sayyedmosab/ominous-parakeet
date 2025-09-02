import React from 'react';
import ReactDOM from 'react-dom/client';
import SimpleTest from './SimpleTest';
import '../index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <SimpleTest />
  </React.StrictMode>
);