import React from 'react';

import iconSpinner from '~/assets/spinner.svg';
import iconCheckmark from '~/assets/checkmark.svg'

import './Progress.css';


// const INITIAL_PROGRESS_BAR_STATE = {
//   value: 0,
//   max: 100,
//   percentLabel: '0%',
//   statusLabel: 'Solving Board...'
// }


type ProgressProps = {
  appState: string;
  solvingState: any;
};
function Progress (props : ProgressProps) {

  const getTextProgressLabelTitle = () : string => {
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

  const getTextProgressLabelPercentComplete = () : string => {
    const max = props.solvingState.countFound;
    const value = props.solvingState.countChecked;
    const percentComplete = (value / max) * 100;
    return `${percentComplete.toFixed(0)}%`;
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
        <label>{getTextProgressLabelTitle()}
          <progress
            max={props.solvingState.countFound}
            value={props.solvingState.countChecked}
          />
          {getTextProgressLabelPercentComplete()}
        </label>
      </div>

      <div className='progress-section3'>
        <div>{props.solvingState.status}</div>
        <div>{props.solvingState.stage}</div>
        <div>{props.solvingState.countFound}</div>
        <div>{props.solvingState.countChecked}</div>
        <div>{props.solvingState.countValid}</div>
      </div>

    </div>
  );
};

export default Progress;
