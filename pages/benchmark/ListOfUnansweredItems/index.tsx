import React, { ReactElement } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

const ListOfUnansweredItemsConnector = (): ReactElement | null => {
  const { globalState } = useTypedSelector((state: { multipleSelectChoices: any; }) => state.multipleSelectChoices);
  const { tabsData } = useTypedSelector((state: { tabs: any; }) => state.tabs);
  console.log(globalState, `--> globalState`);
  let obj = [];
  for (const property in globalState) {
    console.log(`${property}: ${JSON.stringify(globalState[property])}`);
    if(globalState[property] && property != 'eliminated') {
      obj[property] = globalState[property];
      console.log(Object.keys(globalState[property]), `--> globalState[`+property+`]`);
      obj.push(Object.keys(globalState[property])[0]);
    }
  }
  let answeredQuestions = obj.map(v => +v + 1);
  // console.log(answeredQuestions, `--> answeredQuestions`);
  let allQuestions = Array.from(Array(tabsData.length - 1).keys()).map((_, i) => i + 1);
  // console.log(allQuestions, `--> allQuestions`);
  const filteredArray = allQuestions.filter(value => !answeredQuestions.includes(value));
  // console.log(filteredArray, `--> filteredArray`);
  return (
    <ul>
      {filteredArray.map(v => <li key={v}>Question {v}</li>)}
    </ul>
  );
};

export default ListOfUnansweredItemsConnector;
