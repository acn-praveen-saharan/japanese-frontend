import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Kanji from './components/KanjiCards';
import { GlobalProvider } from "./context/GlobalContext";

function App() {
  return (
    <GlobalProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kanji" element={<Kanji />} />
      </Routes>
    </Router>
    </GlobalProvider>
  );
}

export default App;
