import React from 'react';

import Point from '~/utils/Point';

import './Board.css';


type BoardProps = {
  appState: string;
  boardSize: number;
  tileLetters: Array<Array<string>>;
  onTileLetterChanged: (x: number, y: number, letter: string) => void;
  highlightedTiles: Array<Point>;
};
function Board (props : BoardProps) {

  const isTileHighlighted = (x: number, y: number) : boolean => {
    for (let i = 0; i < props.highlightedTiles.length; i++) {
      const point = props.highlightedTiles[i];
      if (point.x == x && point.y == y) {
        return true;
      }
    }
    return false;
  };

  const onTileValueChanged = (event : React.ChangeEvent<HTMLInputElement>, x : number, y : number) : void => {
    const value = event.target.value.toUpperCase();
    if (!'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(value)) {
      return;
    }

    props.onTileLetterChanged(x, y, value);

    // Tab to next tile
    let xNext = x;
    let yNext = y;
    if (y + 1 < props.boardSize) {
      yNext += 1;
    } else {
      yNext = 0;
      if (x + 1 < props.boardSize) {
        xNext += 1;
      } else {
        xNext = 0;
      }
    }

    const elementId = `board-tile-${xNext}-${yNext}`;
    document.getElementById(elementId)?.focus();
  };

  const onTileClicked = (event: React.MouseEvent<HTMLInputElement>) : void => {
    event.currentTarget.select();
  };

  return (
    <div className='board-container'>

      <div className='board-section'>
        {
          Array.from({ length: props.boardSize }, (_, x) => (
            <div key={x}>
              {
                Array.from({ length: props.boardSize }, (_, y) => (
                  <input
                    id={`board-tile-${x}-${y}`}
                    key={`${x}-${y}`}
                    className={isTileHighlighted(x, y) ? 'board-tile-selected' : 'board-tile-input'}
                    onChange={(event) => onTileValueChanged(event, x, y)}
                    onClick={onTileClicked}
                    maxLength={1}
                    value={props.tileLetters[x][y]}
                    disabled={props.appState == 'working' || props.appState == 'finished'}
                  />
                ))
              }
            </div>
          ))
        }
      </div>

    </div>
  );
}

export default Board;
