import wordlistJson from './wordlist.json'
const wordlist = wordlistJson as Array<string>;


class WordValidator {
  public constructor() {
  };

  public getValidWords(rawStrings : Array<string>) : Array<string> {
    let validWords: Array<string> = [];

    for (let i = 0; i < wordlist.length; i++) {
      let validWord: string = wordlist[i];

      for (let j = 0; j < rawStrings.length; j++) {
        let rawString: string = rawStrings[j];
        if (rawString == validWord) {
          validWords.push(rawString);
          break;
        }
      }
    }

    return validWords;
  }

  public sortWords(words : Array<string>) : void {
    words.sort((a, b) => a > b ? 1 : -1);
    words.sort((a, b) => b.length - a.length);
  }
}

export default WordValidator;
