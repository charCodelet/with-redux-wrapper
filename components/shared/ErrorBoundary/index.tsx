import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorState {
  hasError: boolean;
}

function logErrorToMyService(error: Error, errorInfo: ErrorInfo) {
  // todo: should be replaced with an error logging service
  console.error(error, errorInfo);
}

// todo: add an onError event prop to this component so that
// the parent component can be notified of string errors and
// then take the appropriate action (going to next item)
class ErrorBoundary extends Component<Record<string, unknown>, ErrorState> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): Record<string, boolean> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logErrorToMyService(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <>
          <div>
            <div>
              <h3>Oh no!</h3>
              <span>😱</span>
            </div>
          </div>
          <div>
            <span>There was a problem rendering this item.</span>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
