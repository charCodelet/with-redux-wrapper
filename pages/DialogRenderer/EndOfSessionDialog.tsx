import React, { ReactElement } from 'react';
import { Button, Dialog, Flex, Paragraph } from '@coreym/benchmark';
import { stateMachineActions } from '@enaep-ng/student-assessment-store';
import { useBroadcast } from '../../hooks/stateMachineHooks';
// import { createNavigateToNextBlockAction } from '../../stateMachineActions/actions/appLifeCycleActions/navigationActions';
//TODO: for now this is a copy of Next block dialog; change the text + selectors in the component
const EndOfSessionDialog = (): ReactElement => {
  console.log('EndOfSessionDialog');
  const broadcast = useBroadcast();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onClose = () => {};
  const onGoToNextBlock = () => broadcast(stateMachineActions.createNavigateToNextBlockAction());
  //TODO : add here RxJs selectors to get data required for the text in this component.
  return (
    <Dialog title="Review" isOpen={true} onClose={onClose}>
      <Flex flexDirection="column">
        <Paragraph>
          You have 28 minutes left to complete or review your work in this Block. You will not be able to return once
          you go on to the next section.
        </Paragraph>
        <Paragraph>Are you sure you want to go on to the next section?</Paragraph>
        <Flex justifyContent="space-between">
          <Button sx={{ width: '200px' }} onClick={onClose}>
            Keep working on this section
          </Button>
          <Button sx={{ width: '200px' }} onClick={onGoToNextBlock}>
            Go on to the next section
          </Button>
        </Flex>
      </Flex>
    </Dialog>
  );
};

export default EndOfSessionDialog;
