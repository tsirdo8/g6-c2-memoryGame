import React from "react";
import { Link } from "react-router-dom";

const GamePage = ({theme, gridSize, players}) => {

  const grid4 = []
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
    

      <Link to="/" className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
        Back to Home
      </Link>
    </div>
  );
};

export default GamePage;