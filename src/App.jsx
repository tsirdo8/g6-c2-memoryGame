import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import GamePage from "./components/GamePage";

const App = () => {
  const [theme, setTheme] = useState("numbers");
  const [players, setPlayers] = useState("1");
  const [gridSize, setGridSize] = useState("4");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage setTheme={setTheme} theme={theme} setPlayers={setPlayers} players={players}  setGridSize={setGridSize}  gridSize={gridSize}/>} />
        <Route path="/game" element={<GamePage />} theme={theme} players={players} gridSize={gridSize}/>
      </Routes>
    </Router>
  );
};

export default App;
