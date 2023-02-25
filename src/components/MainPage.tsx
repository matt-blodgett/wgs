import React, { useState } from 'react';

import Board from '~/components/board/Board';
import WordList from '~/components/wordList/WordList';
import Progress from '~/components/progress/Progress';
import Controls from '~/components/controls/Controls';

import Point from '~/utils/Point';

import './MainPage.css';


const BOARD_SIZE = 4;
const DEFAULT_LETTERS = [
  ['A', 'B', 'C', 'D'],
  ['E', 'F', 'G', 'H'],
  ['I', 'J', 'K', 'L'],
  ['M', 'N', 'O', 'P']
];
const APP_STATES = [
  'initial',
  'invalid',
  'ready',
  'working',
  'finished'
];


const DEFAULT_SOLVING_STATE = {
  status: 'initial',
  stage: null,
  countFound: 0,
  countChecked: 0,
  countValid: 0
};


function MainPage () {
  const [appState, setAppState] = React.useState<string>('initial');

    // Should create type instead of passing "any"
  const [solvingState, setSolvingState] = React.useState<any>(DEFAULT_SOLVING_STATE);

  const [wordList, setWordList] = React.useState<Array<string>>([]);
  const [wordPointsMap, setWordPointsMap] = React.useState<Map<string, Array<Point>>>(new Map<string, Array<Point>>());

  const [selectedWordPoints, setSelectedWordPoints] = React.useState<Array<Point>>([]);

  const [tileLetters, setTileLetters] = React.useState<Array<Array<string>>>(DEFAULT_LETTERS);
  const [defaultTileLetters, setDefaultTileLetters] = React.useState<Array<Array<string>>>(DEFAULT_LETTERS);

  const onWorkerEvent = (worker : Worker, event : MessageEvent) : void => {
    const { status, data } = event.data;

    if (status == 'working') {
      // const newSolvingState = {status: status, ...data}
      setSolvingState(data);
    } else if (status == 'done') {
      worker.terminate()
      finishSolving(data);
    }
  };

  const runWorker = (params: object) : void => {
    const worker = new Worker('./worker.tsx', { type: 'module' });
    worker.postMessage(params);
    worker.onerror = (err) => {
      console.log(err);
    };
    worker.onmessage = (event) => {
      onWorkerEvent(worker, event);
    };
  };

  const finishSolving = (data: any) : void => {
    const { validWords, boardStringPointMap, elapsedTime } = data;

    console.log(`finishSolving: elapsedTime=${elapsedTime}`);

    const newWordPointsMap = new Map<string, Array<Point>>();
    validWords.forEach((word: string) => {
      const points = boardStringPointMap.get(word) || null;
      if (points) {
        newWordPointsMap.set(word, points);
      }
    })

    setWordList(validWords);
    setWordPointsMap(newWordPointsMap);

    setAppState('finished');
  };

  const startSolving = (minLength: number, maxLength: number) : void => {
    setAppState('working');

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
  };

  const resetState = () : void => {
    setWordList([]);
    setWordPointsMap(new Map<string, Array<Point>>());
    setSelectedWordPoints([]);

    const newTileLetters = [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', '']
    ];
    setTileLetters(newTileLetters);
    setDefaultTileLetters(newTileLetters);

    setSolvingState(DEFAULT_SOLVING_STATE);
    setAppState('initial');
  };

  const selectedWordChanged = (word: string) : void => {
    const points = wordPointsMap.get(word) || null;
    if (points) {
      setSelectedWordPoints(points);
    }
  };

  const tileLettersChanged = (tileLetters: Array<Array<string>>) : void => {
    setTileLetters(tileLetters);

    let isBoardValid = true;
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
  };

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

      {
        (appState == 'working' || appState == 'finished') &&
        <div className='row'>
          <div className='column'>
            <Progress
              appState={appState}
              solvingState={solvingState}
            />
          </div>
        </div>
      }

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
