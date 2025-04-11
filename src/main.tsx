// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Make sure we only create one root
let root;
const rootElement = document.getElementById('root');

if (!root && rootElement) {
  root = ReactDOM.createRoot(rootElement);
}

// // Add a testing function to ensure the error boundary works
// function TestErrorButton() {
//   const [shouldError, setShouldError] = React.useState(false);
  
//   if (shouldError) {
//     throw new Error("Test error triggered by user");
//   }
  
//   return (
//     <button 
//       onClick={() => setShouldError(true)}
//       style={{
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         padding: '8px 12px',
//         background: '#f44336',
//         color: 'white',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         zIndex: 9999,
//       }}
//     >
//       Test Error Boundary
//     </button>
//   );
// }

// Wrap with ErrorBoundary
if (root) {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}