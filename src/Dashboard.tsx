import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function Dashboard() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  const onSignInButtonClick = () => {
    navigate('/login');
  };
  const onSignOutButtonClick = () => {
    signOut();
  };
  const signComponent = user ? (
    <button onClick={onSignOutButtonClick}>Sign Out</button>
  ) : (
    <button onClick={onSignInButtonClick}>Sign In</button>
  );

  return (
    <main>
      <h1>Welcome to the Dashboard, {user?.username}</h1>
      {signComponent}
    </main>
  );
}
