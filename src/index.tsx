import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
} else {
    console.error('Root element not found');
}
