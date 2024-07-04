import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './Login';
import { Authenticator } from '@aws-amplify/ui-react';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: (
      <Authenticator.Provider>
        <Login />
      </Authenticator.Provider>
    ),
    errorElement: <>Error</>,
  },
]);
