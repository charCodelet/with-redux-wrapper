import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import themes from '../themes';
import { Box } from '@coreym/benchmark';

const ThemeProviderTS = ({ theme = themes.default, children }) => (
  <EmotionThemeProvider theme={theme}>
    <Box
      sx={{
        color: 'text',
        bg: 'bg',
        width: '100%',
        height: '100%',
        fontSize: 3,
        fontFamily: 'body'
      }}
    >
      {children}
    </Box>
  </EmotionThemeProvider>
);

export default ThemeProviderTS;
