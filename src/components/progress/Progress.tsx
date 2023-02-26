import React from 'react';

import iconSpinner from '~/assets/spinner.svg';
import iconCheckmark from '~/assets/checkmark.svg'

import './Progress.css';


type TimeElapsedProps = {
  working: boolean;
};
function TimeElapsed (props : TimeElapsedProps) {
  const [secondsElapsed, setSecondsElapsed] = React.useState<number>(0);
  const [secondsTimer, setSecondsTimer] = React.useState<NodeJS.Timer | undefined>(undefined);

  const tick = () : void => {
    setSecondsElapsed((seconds) => seconds + 1);
  };

  React.useEffect(() => {
    const interval = setInterval(tick, 1000);
    setSecondsTimer(interval);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (!props.working) {
      clearInterval(secondsTimer);
    }
  }, [props.working])

  const getTextTimeElapsed = () : string => {
    return new Date(secondsElapsed * 1000).toISOString().slice(11, 19);
  };

  return (
    <div>Time Elapsed: {getTextTimeElapsed()}</div>
  );
}


type ProgressProps = {
  appState: string;
  solvingState: any;
};
function Progress (props : ProgressProps) {

  const getTextStatusTitle = () : string => {
    const stage = props.solvingState.stage;
    if (props.appState == 'finished') {
      return 'Completed';
    } else {
      if (!stage) {
        return 'Solving Board...';
      } else if (stage == 'board') {
        return 'BOARD';
      } else if (stage == 'validator') {
        return 'Finding valid words';
      }
    }
    return '';
  };

  const getTextPercentComplete = () : string => {
    const max = props.solvingState.countFound;
    const value = props.solvingState.countChecked;
    const percentComplete = (value / max) * 100;
    return `${percentComplete.toFixed(0)}%`;
  };

  const getTextCheckedVersusFound = () : string => {
    return `Checked Strings: ${props.solvingState.countChecked} / ${props.solvingState.countFound}`;
  };

  const getTextCountValid = () : string => {
    return `Valid Words: ${props.solvingState.countValid}`;
  };

  return (
    <div className='progress-container'>

      <div className='progress-section1'>
        {
          props.appState == 'working' &&
          <img src={iconSpinner} alt='' />
        }
        {
          props.appState == 'finished' &&
          <img src={iconCheckmark} className='progress-checkmark' alt='' width={200} height={50} />
        }
      </div>

      <div className='progress-section2'>
        <label>{getTextStatusTitle()}
          <progress
            max={props.solvingState.countFound}
            value={props.solvingState.countChecked}
          />
          {getTextPercentComplete()}
        </label>
      </div>

      <div className='progress-section3'>
        <TimeElapsed
          working={props.appState == 'working'}
        />
        <div>{getTextCheckedVersusFound()}</div>
        <div>{getTextCountValid()}</div>
      </div>

    </div>
  );
}

export default Progress;
