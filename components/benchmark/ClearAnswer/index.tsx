/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement } from 'react';
import { Button } from '@coreym/benchmark';
// import { clearAnswerAction } from '../../../store/actions/responses/clearAnswerActions';
// import { useBroadcast } from '../../../stateMachine/customHooks';
import { Widget } from '@enaep-ng/types';
//TODO: This connector needs further discussion within our team.Looks like this is
//not used anywhere in the current Json. Also because we need to walk up the Json hierarchy
// to find a parent who holds a widgetResponse object - this kind of code is not required
//for any of the other widget/item.
//
// export const ClearAnswer = (inputId: string): ReactElement => {
export const ClearAnswer = (_widget: Widget): ReactElement => {
  // const broadcast = useBroadcast();
  // const clear = () => broadcast(clearAnswerAction({ id: inputId }));
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const clear = () => {};
  return (
    <Button variant="secondary" onClick={clear}>
      Clear Answer
    </Button>
  );
};

export default ClearAnswer;
