import BoardAnalyzer from '../src/utils/BoardAnalyzer';
import WordValidator from '../src/utils/WordValidator';


onmessage = (event) => {
  const startTime = new Date().getTime();

  const { boardSize, tileLetters, minLength, maxLength } = event.data;
  
  let boardAnalyzer = new BoardAnalyzer(boardSize, tileLetters);
  let boardStringPointMap = boardAnalyzer.getValidStringPointMap(minLength, maxLength);
  let boardStrings = [...boardStringPointMap.keys()];

  let wordValidator = new WordValidator();
  let validWords = wordValidator.getValidWords(boardStrings);
  wordValidator.sortWords(validWords);

  postMessage({
    validWords: validWords,
    boardStringPointMap: boardStringPointMap,
    time: new Date().getTime() - startTime,
  });
};
