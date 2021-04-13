import React, { ReactElement } from 'react';
import { Button } from '@coreym/benchmark';

export const ButtonConnector = (): ReactElement | null => {
  const handleClick = () => {
   
  };
  return (
    <Button onClick={handleClick}/>
  );
};

export default ButtonConnector;
