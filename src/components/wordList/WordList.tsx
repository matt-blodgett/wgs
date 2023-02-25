import React from 'react';

import './WordList.css';


type WordListProps = {
  appState: string;
  wordList: Array<string>;
  onSelectedWordChanged: (word: string) => void;
};
function WordList (props : WordListProps) {

  const onSelectionChanged = (event : React.ChangeEvent<HTMLSelectElement>) : void => {
    props.onSelectedWordChanged(event.target.value);
  };

  return (
    <div className='wordlist-container'>

      <select className='wordlist-select' onChange={onSelectionChanged} size={7}>
        {
          props.wordList.map((word, index) => {
            return ( <option value={word} key={index}>{word}</option> )
          })
        }
      </select>

    </div>
  );
}

export default WordList;
