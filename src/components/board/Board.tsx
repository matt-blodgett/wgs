import React from 'react';

import './Board.css';

import Point from '../../utils/Point';
 

type BoardProps = {
  appState: string,
  boardSize: number,
  defaultLetters: Array<Array<string>>,
  selectedPoints: Array<Point>;
  onTileLettersChanged: (tileLetters : Array<Array<string>>) => void
};
function Board (props : BoardProps) {
  const [tileLetters, setTileLetters] = React.useState<Array<Array<string>>>(props.defaultLetters);

  React.useEffect(() => {
    setTileLetters(props.defaultLetters);
    props.onTileLettersChanged(props.defaultLetters);
  })

  const onTileValueChanged = (event : React.ChangeEvent<HTMLInputElement>, x : number, y : number) : void => {
    let newValue = event.target.value.toUpperCase();
    if (!'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(newValue)) {
      return;
    }

    let newLetters = [...tileLetters];
    newLetters[x][y] = newValue;
    setTileLetters(newLetters);
    props.onTileLettersChanged(newLetters);
  };

  const isTileSelected = (x: number, y: number) : boolean => {
    for (let i = 0; i < props.selectedPoints.length; i++) {
      let point: Point = props.selectedPoints[i];
      if (point.x == x && point.y == y) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className='board-container'>

      <div>
        {
          Array.from({ length: props.boardSize }, (_, x) => (
            <div key={x}>
              {
                Array.from({ length: props.boardSize }, (_, y) => (
                  <input
                    className={isTileSelected(x, y) ? 'board-tile-selected' : 'board-tile-input'}
                    onChange={(event) => onTileValueChanged(event, x, y)}
                    value={tileLetters[x][y]}
                    key={`${x}-${y}`}
                    maxLength={1}
                  />
                ))
              }
            </div>
          ))
        }
      </div>

    </div>
  );
};

export default Board;
