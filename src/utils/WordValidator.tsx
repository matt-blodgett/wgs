import wordlistJson from './wordlist.json'
const wordlist = wordlistJson as Array<string>;


class WordValidator {
  public constructor() {}

  public getValidWords(
    rawStrings : Array<string>,
    progressUpdates = {
      callback: (countChecked: number, countValid: number) => {countChecked; countValid},
      frequency: -1
    }
  ) : Array<string>
  {
    const validWords = [];

    progressUpdates.callback(0, 0);

    for (let i = 0; i < rawStrings.length; i++) {
      const rawString = rawStrings[i];

      for (let j = 0; j < wordlist.length; j++) {
        const validWord = wordlist[j];
        if (rawString == validWord) {
          validWords.push(validWord);
          break;
        }
      }

      if (progressUpdates.frequency > 0) {
        const countChecked = i + 1;
        if ((countChecked % progressUpdates.frequency) == 0) {
          const countValid = validWords.length;
          progressUpdates.callback(countChecked, countValid);
        }
      }
    }

    progressUpdates.callback(rawStrings.length, validWords.length);

    return validWords;
  }

  public sortWords(words : Array<string>) : void {
    words.sort((a, b) => a > b ? 1 : -1);
    words.sort((a, b) => b.length - a.length);
  }
}

export default WordValidator;
