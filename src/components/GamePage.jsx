import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const GamePage = ({ theme = "numbers", players = "1", gridSize = "4" }) => {
  // Safely parse players to integer with bounds checking
  const numPlayers = Math.max(1, Math.min(4, parseInt(players) || 1));
  
  // State initialization with proper defaults
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState(Array(numPlayers).fill(0));
  const [gameOver, setGameOver] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, [gridSize, theme, players]);

  const initializeGame = () => {
    // Determine number of pairs based on grid size with fallback
    const pairCount = gridSize === "4" ? 8 : 18;
    
    // Create pairs of cards with type safety
    let cardValues = [];
    if (theme === "numbers") {
      cardValues = Array.from({ length: pairCount }, (_, i) => i + 1);
    } else {
      // Icons theme - using emojis with fallback
      const icons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐮',
                    '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄'];
      cardValues = icons.slice(0, pairCount);
    }
    
    // Safely create and shuffle cards
    const cardPairs = [...cardValues, ...cardValues];
    const shuffledCards = shuffleArray(cardPairs);
    
    setCards(shuffledCards.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      solved: false
    })));
    
    // Reset all game states
    setFlipped([]);
    setSolved([]);
    setScores(Array(numPlayers).fill(0));
    setCurrentPlayer(0);
    setGameOver(false);
    setMoves(0);
    setShowRestartModal(false);
  };

  const shuffleArray = (array) => {
    if (!Array.isArray(array)) return [];
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardClick = (id) => {
    // Prevent invalid clicks
    if (disabled || flipped.length === 2 || solved.includes(id) || cards[id]?.flipped || gameOver) {
      return;
    }

    // Flip the card safely
    const newCards = [...cards];
    if (newCards[id]) {
      newCards[id].flipped = true;
      setCards(newCards);
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    // Check for match after two cards are flipped
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setDisabled(true);
      setTimeout(() => checkForMatch(newFlipped), 500);
    }
  };

  const checkForMatch = (flippedCards) => {
    if (flippedCards.length !== 2) {
      setDisabled(false);
      return;
    }

    const [firstId, secondId] = flippedCards;
    const firstCard = cards[firstId];
    const secondCard = cards[secondId];

    if (!firstCard || !secondCard) {
      setDisabled(false);
      return;
    }

    if (firstCard.value === secondCard.value) {
      // Match found
      const newSolved = [...solved, firstId, secondId];
      setSolved(newSolved);
      
      // Update score safely
      setScores(prev => {
        const newScores = [...prev];
        if (typeof newScores[currentPlayer] === 'number') {
          newScores[currentPlayer] += 1;
        }
        return newScores;
      });
      
      // Check if game is over
      if (newSolved.length === cards.length) {
        setGameOver(true);
      }
    } else {
      // No match - flip cards back
      const newCards = [...cards];
      if (newCards[firstId]) newCards[firstId].flipped = false;
      if (newCards[secondId]) newCards[secondId].flipped = false;
      setCards(newCards);
      
      // Switch to next player safely
      if (numPlayers > 1) {
        setCurrentPlayer(prev => (prev + 1) % numPlayers);
      }
    }

    setFlipped([]);
    setDisabled(false);
  };

  const renderCard = (card, index) => {
    if (!card) return null;
    
    const isFlipped = card.flipped || card.solved;
    const isActive = flipped.includes(index);
    
    return (
      <button
        key={card.id}
        onClick={() => handleCardClick(index)}
        className={`flex items-center justify-center rounded-full font-bold text-[40px] md:text-[44px] transition-all duration-300
          ${isFlipped ? 'bg-[#BCCED9] text-[#FCFCFC]' : 'bg-[#304859] text-[#FCFCFC]'}
          ${isActive ? 'ring-4 ring-[#FDA214]' : ''}
          ${card.solved ? 'opacity-60' : ''}
          ${gridSize === "4" ? 'h-16 w-16 md:h-20 md:w-20' : 'h-12 w-12 md:h-16 md:w-16'}`}
        disabled={isFlipped || gameOver}
        aria-label={isFlipped ? `Card showing ${card.value}` : 'Hidden card'}
      >
        {isFlipped ? card.value : ''}
      </button>
    );
  };

  const confirmRestart = () => {
    setShowRestartModal(true);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#152938] w-full p-6">
      {/* Header with game info and controls */}
      <div className="w-full max-w-[327px] md:max-w-[572px] flex justify-between items-center mb-8">
        <h1 className="font-[Atkinson Hyperlegible] font-bold text-[30px] md:text-[40px] text-white">
          memory
        </h1>
        
        <div className="flex gap-2">
          <button
            onClick={confirmRestart}
            className="px-4 py-2 bg-[#FDA214] text-white font-bold rounded-[26px] hover:bg-[#FFB84A] transition-all text-[16px] md:text-[20px]"
          >
            Restart
          </button>
          <Link
            to="/"
            className="px-4 py-2 bg-[#DFE7EC] text-[#304859] font-bold rounded-[26px] hover:bg-[#6395B8] hover:text-white transition-all text-[16px] md:text-[20px]"
          >
            Menu
          </Link>
        </div>
      </div>

      {/* Game board */}
      <div className={`grid ${gridSize === "4" ? 'grid-cols-4 gap-3 md:gap-4' : 'grid-cols-6 gap-2 md:gap-3'} mb-8`}>
        {cards.map((card, index) => renderCard(card, index))}
      </div>

      {/* Score cards */}
      <div className={`grid ${numPlayers === 1 ? 'grid-cols-1' : `grid-cols-${numPlayers}`} gap-3 md:gap-6 w-full max-w-[327px] md:max-w-[572px]`}>
        {scores.map((score, index) => (
          <div 
            key={index} 
            className={`bg-[${currentPlayer === index ? '#FDA214' : '#DFE7EC'}] rounded-[10px] p-3 md:p-4 text-center`}
          >
            <p className={`font-[Atkinson Hyperlegible] text-[15px] md:text-[18px] ${currentPlayer === index ? 'text-white' : 'text-[#7191A5]'}`}>
              {numPlayers === 1 ? "Time" : `Player ${index + 1}`}
            </p>
            <p className={`font-[Atkinson Hyperlegible] font-bold text-[24px] md:text-[32px] ${currentPlayer === index ? 'text-white' : 'text-[#304859]'}`}>
              {score}
            </p>
          </div>
        ))}
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] p-6 md:p-8 max-w-[327px] md:max-w-[654px] w-full text-center">
            <h2 className="font-[Atkinson Hyperlegible] font-bold text-[24px] md:text-[48px] text-[#152938] mb-4">
              {numPlayers === 1 ? "You did it!" : "Game Over!"}
            </h2>
            <p className="text-[14px] md:text-[18px] text-[#7191A5] mb-6 md:mb-8">
              {numPlayers === 1 
                ? `Game completed in ${moves} moves!` 
                : "Check out the final scores below"}
            </p>
            
            {numPlayers !== 1 && (
              <div className="mb-6 md:mb-8 space-y-2">
                {scores.map((score, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center p-3 md:p-4 rounded-[10px] ${index === currentPlayer ? 'bg-[#152938]' : 'bg-[#DFE7EC]'}`}
                  >
                    <span className={`font-[Atkinson Hyperlegible] text-[13px] md:text-[18px] ${index === currentPlayer ? 'text-white' : 'text-[#7191A5]'}`}>
                      Player {index + 1} {index === currentPlayer && "(Winner)"}
                    </span>
                    <span className={`font-[Atkinson Hyperlegible] font-bold text-[20px] md:text-[32px] ${index === currentPlayer ? 'text-white' : 'text-[#304859]'}`}>
                      {score} Pairs
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={initializeGame}
                className="px-6 py-3 bg-[#FDA214] text-white font-bold rounded-[26px] hover:bg-[#FFB84A] transition-all"
              >
                Play Again
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-[#DFE7EC] text-[#304859] font-bold rounded-[26px] hover:bg-[#6395B8] hover:text-white transition-all"
              >
                Setup New Game
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Restart Confirmation Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] p-6 md:p-8 max-w-[327px] w-full text-center">
            <h2 className="font-[Atkinson Hyperlegible] font-bold text-[24px] text-[#152938] mb-4">
              Restart Game?
            </h2>
            <p className="text-[14px] text-[#7191A5] mb-6">
              Are you sure you want to restart this game?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRestartModal(false)}
                className="px-6 py-3 bg-[#DFE7EC] text-[#304859] font-bold rounded-[26px] hover:bg-[#6395B8] hover:text-white transition-all flex-1"
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  setShowRestartModal(false);
                  initializeGame();
                }}
                className="px-6 py-3 bg-[#FDA214] text-white font-bold rounded-[26px] hover:bg-[#FFB84A] transition-all flex-1"
              >
                Yes, Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

GamePage.propTypes = {
  theme: PropTypes.oneOf(['numbers', 'icons']),
  players: PropTypes.oneOf(['1', '2', '3', '4']),
  gridSize: PropTypes.oneOf(['4', '6'])
};

export default GamePage;