import React from 'react';
import Math from './Math';
import Stack from '../Stack/Stack';
import { Flex } from '../Base';

import examples from './examples';

export default {
  title: 'Elements/MathML',
  component: Math
};

export function Basic() {
  return (
    <Stack>
      <Math>
        {`<math xmlns="http://www.w3.org/1998/Math/MathML">
            <menclose notation="box circle">
              <mi>x</mi><mo>+</mo><mi>y</mi>
            </menclose>
          </math>`}
      </Math>
    </Stack>
  );
}
export function StressTest() {
  return (
    <Stack>
      {examples.map((example, index) => {
        return (
          <Flex justifyContent="left" alignItems="center">
            <Math key={index}>{example.mathML}</Math>
          </Flex>
        );
      })}
    </Stack>
  );
}
