import React from "react";

export class ErrorBoundary extends React.Component {
  // @ts-ignore
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // @ts-ignore
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // @ts-ignore
  componentDidCatch(error, info) {
    console.log(error, info.componentStack);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // @ts-ignore
      return this.props.fallback;
    }

    // @ts-ignore
    return this.props.children;
  }
}
