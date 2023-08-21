import Router from 'next/router';
import React from 'react';

export const withAuth = (WrappedComponent) => {
  return (props) => {
    // Check if the user is authenticated
    // Replace this with your own authentication logic
    const userAuthenticated = false;

    if (!userAuthenticated) {
      // If the user is not authenticated, redirect them to the login page
      Router.push('/login');
    }

    return <WrappedComponent {...props} />;
  };
};
