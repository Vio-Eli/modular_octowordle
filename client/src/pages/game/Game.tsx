import React, { useState, useRef, useEffect, useCallback } from 'react';
import Grid, { GridState } from '../../components/grid/Grid';
import dict from '../../utils/dict.json';
import pick from '../../utils/pick';
import './Game.scss';

enum GameState {
  Playing,
  Won,
  Lost
}

const newGame = () => {
  window.location.reload();
}

function getWords(wordLength: number, numWords: number): string[] {

  const eligible = dict.filter((word) => word.length === wordLength);
  let wordArr: string[] = [];

  for (let i = 0; i < numWords; i++) {
    let word: string = pick(eligible);
    // Ensures no duplication of words (extra precaution)
    if (!wordArr.includes(word)) {
      wordArr.push(word);
    }
  }

  //console.log(wordArr);
  return wordArr;
}

let stateArr: number[] = [0];

function Game() {

  const wordLength: number = 5;
  const numGrids: number = 1;
  const numGuesses: number = numGrids + 5;
  const tableRef = useRef<HTMLTableElement>(null);

  const [warning, setWarning] = useState('');
  const [warningColor, setWarningColor] = useState<string>('red');
  const [guessArr, setGuessArr] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [answer, setAnswer] = useState<string[]>(getWords(wordLength, 1));

  const [gameState, setGameState] = useState<GameState>(GameState.Playing);

  // Callback for each grid to set if won or lost
  let GridChecker = useCallback(
    (gridNum: number, gridState: GridState) => {
      stateArr[gridNum] = gridState;
    }, [],
  );

  useEffect(() => {

    //create log on key press
    const onKey = (key: string) => {

      if (/^[a-z]$/i.test(key)) {
        setCurrentGuess((currentGuess) =>
          (currentGuess + key.toLocaleLowerCase()).slice(0, wordLength)
        );
        tableRef.current?.focus();

      } else if (key === "Backspace") {
        setCurrentGuess((currentGuess) => currentGuess.slice(0, -1));

      } else if (key === "Enter") {
        if (currentGuess.length === 0) {
          setWarning("Please enter a word");
          setWarningColor("yellow");
          return;
        }
        if (currentGuess.length !== wordLength) {
          setWarning("Too Short!");
          setWarningColor("yellow");
          return;
        }
        if (!dict.includes(currentGuess)) {
          setWarning("Invalid Word");
          setWarningColor("yellow");
          return;
        }
        if (guessArr.includes(currentGuess)) {
          setWarning("Can't use the same word twice!");
          setWarningColor("yellow");
          return;
        }

        setGuessArr((guessArr) => guessArr.concat([currentGuess]));
        setCurrentGuess((currentGuess) => "");
      }
    };

    // Check Callback GridState --> See if player won or not
    if (stateArr.every(x => x === 1)) {
      setGameState(gameState => GameState.Won);
      setWarning("You've Won!");
      setWarningColor("green");
    } else if (stateArr.some(x => x === 2)) {
      setGameState(gameState => GameState.Lost);
      setWarning(`You've lost. The word was ${answer[0]}`);
      setWarningColor("red");
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        onKey(e.key)
      }
      if (e.key === "Backspace") {
        e.preventDefault()
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };

  }, [currentGuess, guessArr, stateArr]);


  return (
    <div className="gameWrapper">
      <div className="titleWrapper">
        <button onClick={newGame}>new</button>
        <h3>
          <span style={{ color: "#e07680" }}> modular </span>
          <span style={{ color: "#64da7c" }}> wordle </span>
        </h3>
      </div>
      <div className="gridDiv">
        <Grid answer={answer[0]}
          tableRef={tableRef}
          gridChecker={GridChecker}
          currentGuess={currentGuess}
          guessArr={guessArr}
          maxGuesses={numGuesses}
          wordLength={wordLength} />
      </div>
      <div className="warning">
        <span style={{color: (warningColor)}}>{warning}</span>
      </div>
    </div>
  )
}

export default Game;