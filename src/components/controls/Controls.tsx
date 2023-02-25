import React from 'react';

import './Controls.css';


type ControlsProps = {
  appState: string;
  boardSize: number;
  onStartSolving: (minLength : number, maxLength : number) => void;
  onResetState: () => void;
};
function Controls (props: ControlsProps) {
  const [minLength, setMinLength] = React.useState<number>(0);
  const [maxLength, setMaxLength] = React.useState<number>(3);
  const [noLengthConstraints, setNoLengthConstraints] = React.useState<boolean>(false);

  const startSolving = () : void => {
    props.onStartSolving(minLength, maxLength);
  };

  const resetState = () : void => {
    props.onResetState();
  };

  const onMinLengthChanged = (event : React.ChangeEvent<HTMLSelectElement>) : void => {
    setMinLength(Number(event.target.value));
  };

  const onMaxLengthChanged = (event : React.ChangeEvent<HTMLSelectElement>) : void => {
    setMaxLength(Number(event.target.value));
  };

  const onNoLengthContraintsChanged = (event: React.ChangeEvent<HTMLInputElement>) : void => {
    setNoLengthConstraints(event.target.checked);

    if (event.target.checked) {
      setMinLength(0);
      setMaxLength(props.boardSize * 2);
    } else {
      setMinLength(0);
      setMaxLength(3);
    }
  };

  return (
    <div className='controls-container'>

      <div className='controls-section1'>
        <button
          className='controls-button'
          onClick={() => startSolving()}
          disabled={props.appState != 'ready'}
        >
          Solve
        </button>
        <button
          className='controls-button'
          onClick={() => resetState()}
          disabled={props.appState == 'working'}
        >
          Reset
        </button>
      </div>

      <div className='controls-section2'>
        <div className='controls-section-title'>Limit Word Lengths</div>

        <div>
          <label
            className='controls-combobox-label'
            htmlFor='cbx_minLength'
          >
            Minimum:
          </label>
          <select
            id='cbx_minLength'
            className='controls-combobox'
            onChange={onMinLengthChanged}
            value={minLength}
            disabled={noLengthConstraints}
          >
            {
              Array.from({ length: (props.boardSize * 2) + 1 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))
            }
          </select>
        </div>

        <div>
          <label
            className='controls-combobox-label'
            htmlFor='cbx_maxLength'
          >
            Maximum:
          </label>
          <select
            id='cbx_maxLength'
            className='controls-combobox'
            onChange={onMaxLengthChanged}
            value={maxLength}
            disabled={noLengthConstraints}
          >
            {
              Array.from({ length: (props.boardSize * 2) + 1 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))
            }
          </select>
        </div>

        <div>
          <label
            htmlFor='chk_noLengthConstraints'
          >
            <input
              id='chk_noLengthConstraints'
              type='checkbox'
              onChange={onNoLengthContraintsChanged}
            />
            Find All Words
          </label>
        </div>

      </div>

    </div>
  );
}

export default Controls;
