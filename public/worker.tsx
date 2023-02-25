import BoardAnalyzer from '../src/utils/BoardAnalyzer';
import WordValidator from '../src/utils/WordValidator';


const UPDATE_FREQUENCY = 100;


onmessage = (event) => {
  const startTime = new Date().getTime();

  const { boardSize, tileLetters, minLength, maxLength } = event.data;

  const progressData = {
    countFound: 0,
    countChecked: 0,
    countValid: 0
  }

  const emitProgressData = (stage) => {
    postMessage({
      status: 'working',
      data: {
        stage: stage,
        ...progressData
      }
    });
  };

  const onBoardProgress = (countFound) => {
    progressData.countFound = countFound;
    emitProgressData('board')
  };

  const onValidatorProgress = (countChecked, countValid) => {
    progressData.countChecked = countChecked;
    progressData.countValid = countValid;
    emitProgressData('validator');
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
      elapsedTime: new Date().getTime() - startTime,
    }
  });
};
