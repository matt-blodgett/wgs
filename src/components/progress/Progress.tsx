import React from 'react';

import iconSpinner from '~/assets/spinner.svg';
import iconCheckmark from '~/assets/checkmark.svg'

import './Progress.css';


type ProgressProps = {
  appState: string
};
function Progress (props : ProgressProps) {

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
        <label htmlFor='progressBar'>Solving Board</label>
        <progress id='progressBar' value='32' max='100'>32%</progress>
      </div>

      <div className='progress-section3'>
        <div>{`Test Progress -> ${props.appState}`}</div>
      </div>

    </div>
  );
};

export default Progress;
