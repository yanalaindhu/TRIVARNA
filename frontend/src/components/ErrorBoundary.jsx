import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
          <div className="bg-white border border-red-100 rounded-3xl p-8 max-w-2xl w-full shadow-lg space-y-4">
            <div className="flex items-center gap-3 text-red-600 justify-center">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-xl font-bold">Application Render Crash</h2>
            </div>
            <p className="text-sm text-gray-600">
              A runtime error occurred in the React component tree. Details:
            </p>
            <div className="p-4 bg-gray-900 text-red-400 rounded-xl text-left text-xs font-mono overflow-auto max-h-40">
              {this.state.error && this.state.error.toString()}
            </div>
            {this.state.errorInfo && (
              <pre className="p-4 bg-gray-900 text-gray-400 rounded-xl text-left text-[10px] font-mono overflow-auto max-h-60 leading-relaxed">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
              >
                Reset Session & Login
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
