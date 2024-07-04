import React, { useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: process.env.userPoolClientId || '',
      userPoolId: process.env.userPoolId || '',
      loginWith: {
        oauth: {
          domain: process.env.domain || '',
          scopes: [
            'openid',
            'email',
            'phone',
            'profile',
            'aws.cognito.signin.user.admin',
          ],
          redirectSignIn: ['http://localhost:3000/', 'https://example.com/'],
          redirectSignOut: ['http://localhost:3000/', 'https://example.com/'],
          responseType: 'code',
        },
        username: true,
        email: false,
        phone: false,
      },
    },
  },
});

export default function Login() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      window.location.href = '/';
    }
  });

  return (
    <Authenticator
      loginMechanism="email"
      signUpAttributes={['email']}
      socialProviders={[
        'amazon',
        'apple',
        'facebook',
        'google',
      ]}></Authenticator>
  );
}
