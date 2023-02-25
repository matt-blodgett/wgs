import React from 'react';

import Point from '~/utils/Point';

import './Board.css';


type BoardProps = {
  appState: string,
  boardSize: number,
  defaultLetters: Array<Array<string>>,
  selectedPoints: Array<Point>,
  onTileLettersChanged: (tileLetters : Array<Array<string>>) => void
};
function Board (props : BoardProps) {
  const [tileLetters, setTileLetters] = React.useState<Array<Array<string>>>(props.defaultLetters);

  React.useEffect(() => {
    setTileLetters(props.defaultLetters);
    // props.onTileLettersChanged(props.defaultLetters);
  }, [props.defaultLetters]);

  const isTileSelected = (x: number, y: number) : boolean => {
    for (let i = 0; i < props.selectedPoints.length; i++) {
      const point: Point = props.selectedPoints[i];
      if (point.x == x && point.y == y) {
        return true;
      }
    }
    return false;
  };

  const onTileValueChanged = (event : React.ChangeEvent<HTMLInputElement>, x : number, y : number) : void => {
    const newValue = event.target.value.toUpperCase();
    if (!'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(newValue)) {
      return;
    }

    const newLetters = [...tileLetters];
    newLetters[x][y] = newValue;
    setTileLetters(newLetters);
    props.onTileLettersChanged(newLetters);

    // Tab to next tile
    let xNext = x;
    let yNext = y;

    if (y + 1 < props.boardSize) {
      yNext = y + 1;
    } else {
      yNext = 0;
      if (x + 1 < props.boardSize) {
        xNext = x + 1;
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
                    className={isTileSelected(x, y) ? 'board-tile-selected' : 'board-tile-input'}
                    onChange={(event) => onTileValueChanged(event, x, y)}
                    onClick={onTileClicked}
                    value={tileLetters[x][y]}
                    key={`${x}-${y}`}
                    maxLength={1}
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
};

export default Board;
