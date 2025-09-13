import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Kanji from './components/KanjiCards';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kanji" element={<Kanji />} />
      </Routes>
    </Router>
  );
}

export default App;
