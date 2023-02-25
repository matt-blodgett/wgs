import BoardAnalyzer from '../src/utils/BoardAnalyzer';
import WordValidator from '../src/utils/WordValidator';


const UPDATE_FREQUENCY = 100;


onmessage = (event) => {
  const startTime = new Date().getTime();

  const { boardSize, tileLetters, minLength, maxLength } = event.data;

  const onBoardProgress = (countFound) => {
    postMessage({
      status: 'working',
      data: {
        stage: 'board',
        countFound: countFound
      }
    });
  };

  const onValidatorProgress = (countChecked, countValid) => {
    postMessage({
      status: 'working',
      data: {
        stage: 'validator',
        countChecked: countChecked,
        countValid: countValid
      }
    });
  };

  const boardProgressUpdates = {
    callback: onBoardProgress,
    frequency: UPDATE_FREQUENCY
  };

  const validatorProgressUpdates = {
    callback: onValidatorProgress,
    frequency: UPDATE_FREQUENCY
  };

  const boardAnalyzer = new BoardAnalyzer(boardSize, tileLetters);
  const boardStringPointMap = boardAnalyzer.getValidStringPointMap(minLength, maxLength, boardProgressUpdates);
  const boardStrings = [...boardStringPointMap.keys()];

  const wordValidator = new WordValidator();
  const validWords = wordValidator.getValidWords(boardStrings, validatorProgressUpdates);
  wordValidator.sortWords(validWords);

  postMessage({
    status: 'done',
    data: {
      validWords: validWords,
      boardStringPointMap: boardStringPointMap,
      time: new Date().getTime() - startTime,
    }
  });
};
