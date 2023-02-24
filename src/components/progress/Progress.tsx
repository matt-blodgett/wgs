import React from 'react';

import iconSpinner from '~/assets/spinner.svg';
import iconCheckmark from '~/assets/checkmark.svg'

import './Progress.css';


const INITIAL_PROGRESS_BAR_STATE = {
  value: 0,
  max: 100,
  percentLabel: '0%',
  statusLabel: 'Solving Board...'
}


type ProgressProps = {
  appState: string
};
function Progress (props : ProgressProps) {
  // Should create interface instead of passing "any"
  const [progressBarValues, setProgressBarValues] = React.useState<any>(INITIAL_PROGRESS_BAR_STATE);

  // const refProgressBar = React.createRef<HTMLProgressElement>();

  const test = () : void => {
    let newProgressBarValues = {...progressBarValues};
    newProgressBarValues.value = newProgressBarValues.value + 10;
    newProgressBarValues.percentLabel = `${newProgressBarValues.max / newProgressBarValues.value}%`
    setProgressBarValues(newProgressBarValues);
  };

  return (
    <div className='progress-container'>

      <div className='progress-section1'>
        {
          props.appState == 'working' &&
          <img src={iconSpinner} />
        }
        {
          props.appState == 'finished' &&
          <img src={iconCheckmark} className='progress-checkmark' />
        }
      </div>

      <div className='progress-section2'>
        <label>{progressBarValues.statusLabel}
          <progress
            value={progressBarValues.value}
            max={progressBarValues.max}
          >{progressBarValues.percentLabel}
          </progress>
        </label>
      </div>

      <div className='progress-section3'>
        <div>{`Test Progress -> ${props.appState}`}</div>
        <button onClick={() => test()}>Test</button>
      </div>

    </div>
  );
};

export default Progress;
