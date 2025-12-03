import React, { Component, ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
          <h1 style={{fontSize: '24px', marginBottom: '16px', color: '#e11d48'}}>Something went wrong.</h1>
          <p style={{marginBottom: '24px'}}>The app crashed unexpectedly.</p>
          <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px', textAlign: 'left', overflow: 'auto', maxWidth: '600px', margin: '0 auto', fontSize: '12px', fontFamily: 'monospace' }}>
            <strong style={{color: '#b91c1c'}}>Error:</strong> {this.state.error?.message}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '24px', padding: '12px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find root element");
  document.body.innerHTML = "<h1 style='color:red;text-align:center;margin-top:50px'>Critical Error: Root Element Missing</h1>";
}