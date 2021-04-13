import React, { ReactElement /*, useState*/ } from 'react';
import { Dialog, Text } from '@coreym/benchmark';

const LoadingIndicator = (): ReactElement | null => {
  // console.log('LoadingIndicator');
  return (
    <Dialog isOpen={true}>
      <Text m="auto">Loading...</Text>
    </Dialog>
  );
};

export default LoadingIndicator;
