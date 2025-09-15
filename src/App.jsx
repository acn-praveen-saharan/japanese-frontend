import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Kanji from './components/KanjiCards';
import { GlobalProvider } from "./context/GlobalContext";
import TodayExam from './components/TodayExam';

function App() {
  return (
    <GlobalProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kanji" element={<Kanji />} />
        <Route path='/examtime' element={<TodayExam />} />
      </Routes>
    </Router>
    </GlobalProvider>
  );
}

export default App;
