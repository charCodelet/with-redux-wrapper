import React, { ReactNode } from 'react';
import { ThemeProvider } from '@emotion/react';
import { OverlayProvider } from '@react-aria/overlays';
import Global from '../Global';
import themes from '../themes';
// import { Box } from '@coreym/benchmark';
import { Box } from '../Base';

interface GlobalProviderProps {
  theme: any; // TODO: type theme strictly
  children: ReactNode;
}
/**
 * Applies application level features such as the theme, css
 * reset and overlay provider.
 */
function GlobalProvider({
  theme = themes.default,
  children
}: GlobalProviderProps) {
  return (
    <>
      {/* CSS Reset */}
      <Global />
      <ThemeProvider theme={theme}>
        <OverlayProvider>
          {/* set default styling */}
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
        </OverlayProvider>
      </ThemeProvider>
    </>
  );
}

export default GlobalProvider;
