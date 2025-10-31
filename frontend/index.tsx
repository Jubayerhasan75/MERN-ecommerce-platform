import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// import './index.css'; <-- ডিলিট করা ফাইলের ইম্পোর্টটি সরানো হয়েছে

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);