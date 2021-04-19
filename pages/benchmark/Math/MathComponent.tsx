import { MathComponent } from 'mathjax-react';

// React.lazy only works with default exports. We are
// re-exporting MathComponent as "default" so that it can be
// lazy loaded in Math.tsx.
export default MathComponent;
