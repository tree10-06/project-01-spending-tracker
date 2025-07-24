import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/spending-tracker" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
      </Routes>
    </>
  );
};

export default App;
