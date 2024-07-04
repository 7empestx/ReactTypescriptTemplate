import React from 'react';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './Dashboard';
import { Authenticator } from '@aws-amplify/ui-react';

export default function App() {
  return (
    <Authenticator.Provider>
      <Dashboard />
    </Authenticator.Provider>
  );
}
