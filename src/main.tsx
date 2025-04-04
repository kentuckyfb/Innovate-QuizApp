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