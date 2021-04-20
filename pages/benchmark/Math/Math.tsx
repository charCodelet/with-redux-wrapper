import React from 'react';
import dynamic from "next/dynamic";
// import MathComponent from './MathComponent';
// mathjax-react breaks SSR by accessing the 'window'
// object. We work around this by lazy loading the
// dependency.
//
// React.lazy only works with default exports,
// so we re-export the named "MathComponent" we need as a
// default in the MathComponent.tsx file.
// const MathComponent = React.lazy(() => import('./MathComponent'));
const MathComponent = dynamic(() => import("./MathComponent"), { ssr: false });

export default function Math({ children }) {
  return (
    // Do not show anything in the fallback area as this is
    // not the primary use-case for using React.lazy &
    // Suspense
    <React.Suspense fallback={<div>Loading...</div>}>
      <MathComponent mathml={`${children}`} display={false} />
    </React.Suspense>
  );
}
