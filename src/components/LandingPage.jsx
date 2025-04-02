import React from "react";
import { Link } from "react-router-dom";

const LandingPage = ({ setTheme, theme, setPlayers, players, gridSize, setGridSize }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#152938] w-full p-4">
        <h1 className="font-[Atkinson Hyperlegible] font-bold text-[35px] text-white mb-14">
            memory
        </h1>
      <div className="bg-white w-full max-w-[327px] md:max-w-[400px] lg:max-w-[500px] rounded-xl shadow-lg p-6 md:p-8">
        {/* theme selection */}
        <h1 className="font-[Atkinson Hyperlegible] font-bold text-[15px] md:text-[18px] text-[#7191A5] mb-4">
          Select Theme
        </h1>

        {/* theme selection buttons */}
        <div className="flex justify-between gap-4 w-full mb-6 md:mb-8">
          <button
            className={`px-4 py-2 rounded-[50px] font-bold w-full h-[40px] md:h-[48px] cursor-pointer text-white transition-all hover:bg-[#6395B8]
              ${theme === "numbers" ? "bg-[#304859]" : "bg-[#BCCED9]"}`}
            onClick={() => setTheme("numbers")}
          >
            Numbers
          </button>

          <button
            className={`px-4 py-2 rounded-[50px] font-bold w-full h-[40px] md:h-[48px] cursor-pointer text-white transition-all hover:bg-[#6395B8]
              ${theme === "icons" ? "bg-[#304859]" : "bg-[#BCCED9]"}`}
            onClick={() => setTheme("icons")}
          >
            Icons
          </button>
        </div>

        {/* players selection */}
        <h2 className="font-[Atkinson Hyperlegible] font-bold text-[15px] md:text-[18px] text-[#7191A5] mb-4">
          Numbers of Players
        </h2>
        
        {/* players selection buttons */}
        <div className="grid grid-cols-4 gap-2 md:gap-3 w-full mb-6 md:mb-8">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              className={`px-2 py-2 rounded-[50px] font-bold w-full h-[40px] md:h-[48px] cursor-pointer text-white transition-all hover:bg-[#6395B8]
                ${players === num.toString() ? "bg-[#304859]" : "bg-[#BCCED9]"}`}
              onClick={() => setPlayers(num.toString())}
            >
              {num}
            </button>
          ))}
        </div>

        {/* grid size selection */}
        <h3 className="font-[Atkinson Hyperlegible] font-bold text-[15px] md:text-[18px] text-[#7191A5] mb-4">
          Grid Size
        </h3>

        {/* grid size selection buttons */}
        <div className="flex justify-between gap-4 w-full mb-8 md:mb-10">
          <button
            className={`px-4 py-2 rounded-[50px] font-bold w-full h-[40px] md:h-[48px] cursor-pointer text-white transition-all hover:bg-[#6395B8]
              ${gridSize === "4" ? "bg-[#304859]" : "bg-[#BCCED9]"}`}
            onClick={() => setGridSize("4")}
          >
            4x4
          </button>

          <button
            className={`px-4 py-2 rounded-[50px] font-bold w-full h-[40px] md:h-[48px] cursor-pointer text-white transition-all hover:bg-[#6395B8]
              ${gridSize === "6" ? "bg-[#304859]" : "bg-[#BCCED9]"}`}
            onClick={() => setGridSize("6")}
          >
            6x6
          </button>
        </div>

        <Link
          to="/game"
          className="w-full h-[48px] md:h-[56px] bg-[#FDA214] text-white font-[Atkinson Hyperlegible] font-bold text-[18px] md:text-[20px] rounded-[50px] flex items-center justify-center hover:bg-[#FFB84A] transition-all"
        >
          Start Game
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;