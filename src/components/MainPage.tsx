import React from 'react';

import Board from './board/Board';
import WordList from './wordList/WordList';
import Controls from './controls/Controls';

import './MainPage.css'


import Point from '../utils/Point';
// import BoardAnalyzer from '../utils/BoardAnalyzer';
// import WordValidator from '../utils/WordValidator';


const BOARD_SIZE : number = 4;
const DEFAULT_LETTERS : Array<Array<string>> = [
  ['A', 'B', 'C', 'D'],
  ['E', 'F', 'G', 'H'],
  ['I', 'J', 'K', 'L'],
  ['M', 'N', 'O', 'P']
];


// const APP_STATES = [
//   "initial",
//   "invalid",
//   "ready",
//   "working",
//   "finished"
// ]


function MainPage () {
  const [appState, setAppState] = React.useState<string>("initial");

  const [wordList, setWordList] = React.useState<Array<string>>([]);
  const [wordPointsMap, setWordPointsMap] = React.useState<Map<string, Array<Point>>>(new Map<string, Array<Point>>());
  const [selectedWordPoints, setSelectedWordPoints] = React.useState<Array<Point>>([]);
  const [tileLetters, setTileLetters] = React.useState<Array<Array<string>>>(DEFAULT_LETTERS);
  const [defaultTileLetters, setDefaultTileLetters] = React.useState<Array<Array<string>>>(DEFAULT_LETTERS);

  const runWorker = (params: object) : void => {
    const worker = new Worker('./worker.tsx', { type: 'module' });
    worker.postMessage(params);
    worker.onerror = (err) => console.log(err);
    worker.onmessage = (event) => {
      finishSolving(event);
      worker.terminate();
    };
  };

  const finishSolving = (event: any) : void => {
    const { validWords, boardStringPointMap, time } = event.data;

    console.log(time);

    let newWordPointsMap: Map<string, Array<Point>> = new Map<string, Array<Point>>();
    validWords.forEach((word: string) => {
      let points: Array<Point> | undefined = boardStringPointMap.get(word);
      if (points) {
        newWordPointsMap.set(word, points);
      }
    })

    setWordList(validWords);
    setWordPointsMap(newWordPointsMap);

    setAppState("finished");
  }

  const startSolving = (minLength: number, maxLength: number) : void => {
    setAppState("working");

    setWordList([]);
    setWordPointsMap(new Map<string, Array<Point>>());
    setSelectedWordPoints([]);
  
    const params = {
      boardSize: BOARD_SIZE,
      tileLetters: tileLetters,
      minLength: minLength,
      maxLength: maxLength
    }

    runWorker(params);
  }

  const resetState = () : void => {
    setWordList([]);
    setWordPointsMap(new Map<string, Array<Point>>());
    setSelectedWordPoints([]);

    const newTileLetters : Array<Array<string>> = [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', '']
    ];
    setTileLetters(newTileLetters);
    setDefaultTileLetters(newTileLetters);

    setAppState("initial");
  }

  const selectedWordChanged = (word: string) : void => {
    let points: Array<Point> | undefined = wordPointsMap.get(word);
    if (points) {
      setSelectedWordPoints(points);
    }
  }

  const tileLettersChanged = (tileLetters: Array<Array<string>>) : void => {
    setTileLetters(tileLetters);

    let isBoardValid: boolean = true;
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (!tileLetters[x][y]) {
          isBoardValid = false;
          break;
        }
      }
      if (!isBoardValid) {
        break;
      }
    }

    if (isBoardValid) {
      setAppState('ready');
    } else {
      setAppState('invalid');
    }
  }

  return (
    <div className='mainpage-container'>

      <div className='row'>
        <div className='column'>
          <Board
            appState={appState}
            boardSize={BOARD_SIZE}
            defaultLetters={defaultTileLetters}
            selectedPoints={selectedWordPoints}
            onTileLettersChanged={tileLettersChanged}
          />
        </div>
        <div className='column'>
          <WordList
            appState={appState}
            wordList={wordList}
            onSelectedWordChanged={selectedWordChanged}
          />
        </div>
      </div>
      <div className='row'>
        <div className='column'>
          <Controls
            appState={appState}
            boardSize={BOARD_SIZE}
            onStartSolving={startSolving}
            onResetState={resetState}
          />
        </div>
      </div>
      
    </div>
  );
};

export default MainPage;
