import { useEffect, useState } from "react";
import { wordList, shuffle } from "./app";
import { Message } from "./components/Message";
import { ScoreCard } from "./components/ScoreCard";

function App() {
  // shuffle the word list and store it in state
  const [wordArray, setWordArray] = useState(shuffle(wordList));
  const [passes, setPasses] = useState(3);
  const [message, setMessage] = useState({ color: "", text: "" });
  const [score, setScore] = useState({ points: 0, strikes: 0 });
  const [gameOver, setGameOver] = useState(false);
  // Track the current word index
  const [wordIndex, setWordIndex] = useState(0);
  const [currentShuffledWord, setCurrentShuffledWord] = useState(shuffle(wordArray[wordIndex]));
  const [input, setInput] = useState("");
  // Track hydration status for local storage synchronization
  const [isHydrated, setIsHydrated] = useState(false);

  // Local Storage Functions
  function writeToLocalStorage() {
    localStorage.setItem("wordArray", JSON.stringify(wordArray));
    localStorage.setItem("passes", passes);
    localStorage.setItem("message", JSON.stringify(message));
    localStorage.setItem("score", JSON.stringify(score));
    localStorage.setItem("gameOver", gameOver);
    localStorage.setItem("wordIndex", wordIndex);
    localStorage.setItem("currentShuffledWord", currentShuffledWord);
    localStorage.setItem("input", input);
  }

  function readFromLocalStorage() {
    const storedWordArray = JSON.parse(localStorage.getItem("wordArray"));
    const storedPasses = parseInt(localStorage.getItem("passes"), 10);
    const storedMessage = JSON.parse(localStorage.getItem("message"));
    const storedScore = JSON.parse(localStorage.getItem("score"));
    const storedGameOver = localStorage.getItem("gameOver") === "true";
    const storedWordIndex = parseInt(localStorage.getItem("wordIndex"), 10);
    const storedCurrentShuffledWord = localStorage.getItem("currentShuffledWord");
    const storedInput = localStorage.getItem("input");

    if (storedWordArray) setWordArray(storedWordArray);
    if (!isNaN(storedPasses)) setPasses(storedPasses);
    if (storedMessage) setMessage(storedMessage);
    if (storedScore) setScore(storedScore);
    setGameOver(storedGameOver);
    if (!isNaN(storedWordIndex)) setWordIndex(storedWordIndex);
    if (storedCurrentShuffledWord) setCurrentShuffledWord(storedCurrentShuffledWord);
    if (storedInput) setInput(storedInput);
  }

  // when the app loads, read from local storage and set hydration to true
  useEffect(() => {
    readFromLocalStorage();
    setIsHydrated(true);
  }, []);

  // whenever any of the game state changes, write to local storage (only if hydrated)
  useEffect(() => {
    if (!isHydrated) return;
    writeToLocalStorage();
  }, [wordArray, passes, message, score, gameOver, wordIndex, currentShuffledWord, input, isHydrated]);

  // Handle input change
  function handleInputChange(e) {
    setInput(e.target.value);
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    const currentWord = wordArray[wordIndex];
    if (input.toLowerCase() === currentWord.toLowerCase()) {
      setScore((prev) => ({ ...prev, points: prev.points + 1 }));
      if (wordIndex < wordArray.length - 1) {
        setMessage({ color: "bg-green-200", text: "Correct, next word!" });
        setWordIndex((prev) => prev + 1);
        setCurrentShuffledWord(shuffle(wordArray[wordIndex + 1]));
        setInput("");
      } else {
        setMessage({ color: "bg-green-200", text: "Congratulations! You've completed all words!" });
        setGameOver(true);
      }
    } else {
      if (score.strikes + 1 >= 3) {
        setMessage({ color: "bg-red-200", text: "You lost." });
        setGameOver(true);
      } else {
        setMessage({ color: "bg-red-200", text: "Wrong, try again!" });
        setInput("");
      }
      setScore((prev) => ({ ...prev, strikes: prev.strikes + 1 }));
    }
  }

  // Handle play again
  function handlePlayAgain() {
    setPasses(3);
    setMessage({ color: "", text: "" });
    setScore({ points: 0, strikes: 0 });
    setGameOver(false);
    setWordIndex(0);
    setCurrentShuffledWord(shuffle(wordArray[0]));
    setInput("");
  }

  // Handle pass
  function handlePass() {
    if (passes > 0) {
      if (wordIndex < wordArray.length - 1) {
        setPasses((prev) => prev - 1);
        setMessage({ color: "bg-blue-200", text: "You passed, next word!" });
        setWordIndex((prev) => prev + 1);
        setCurrentShuffledWord(shuffle(wordArray[wordIndex + 1]));
        setInput("");
      } else {
        setPasses((prev) => prev - 1);
        setMessage({ color: "bg-green-200", text: "Congratulations! You've completed all words!" });
        setGameOver(true);
      }
    }
  }

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-4 py-8 px-4">
      <h1 className="text-6xl text-center">Welcome to Scramble</h1>
      <ScoreCard score={score} />
      <Message color={message.color}>{message.text}</Message>

      <p className="text-center uppercase text-4xl">{currentShuffledWord}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full border border-blue-500 py-1 px-2"
          value={input}
          onChange={handleInputChange}
          disabled={gameOver}
        />
      </form>

      <div className="w-full flex flex-col items-center gap-4">
        <button
          onClick={handlePass}
          disabled={passes === 0 || gameOver}
          className="px-2 py-1 bg-red-500 text-white flex items-center gap-2 cursor-pointer rounded-md"
        >
          <div className="h-5 w-5 bg-white text-black text-sm font-bold rounded-md">{passes}</div>
          <span>Passes Remaining</span>
        </button>

        {gameOver && (
          <button
            onClick={handlePlayAgain}
            className="px-2 py-1 bg-blue-500 text-white flex items-center cursor-pointer rounded-md"
          >
            Play Again?
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
