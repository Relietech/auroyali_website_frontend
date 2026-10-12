import React from 'react';
import { AlertCircle, RefreshCw, Box } from 'lucide-react';

/**
 * Checks if WebGL is available and active in the current browser context.
 */
export function isWebGLAvailable() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false });
    
    // Check if context was successfully obtained and not lost
    if (!gl) return false;
    
    if (typeof gl.isContextLost === 'function' && gl.isContextLost()) {
      return false;
    }
    
    // Clean up
    const loseContextExt = gl.getExtension('WEBGL_lose_context');
    if (loseContextExt) {
      loseContextExt.loseContext();
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * React Error Boundary specifically built to catch WebGL context creation
 * failures and WebGL crashes gracefully without taking down the React tree.
 */
export class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[WebGLErrorBoundary] Caught 3D/WebGL error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, onRetry: this.handleRetry })
          : this.props.fallback;
      }

      return (
        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center bg-stone-900/90 text-stone-200 rounded-2xl border border-stone-800">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
            <Box size={24} />
          </div>
          <h4 className="font-serif text-lg font-medium text-stone-100 mb-1">
            3D Studio Preview Paused
          </h4>
          <p className="text-xs text-stone-400 max-w-sm mb-4 leading-relaxed">
            WebGL is temporarily blocked or unavailable in this browser session. You can reload the viewer or view the specifications directly.
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-earth-700 hover:bg-earth-600 text-stone-100 transition-colors shadow-sm"
          >
            <RefreshCw size={13} />
            <span>Retry 3D Viewer</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebGLErrorBoundary;
