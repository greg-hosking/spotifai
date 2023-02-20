import React from 'react';

function Callback() {
  const params = new URLSearchParams(window.location.hash.substring(1));
  localStorage.setItem('hash', window.location.hash);
  const accessToken = params.get('access_token');

  if (!accessToken) {
    window.location = '/';
  } else {
    localStorage.setItem('access_token', accessToken);
  }

  setTimeout(() => {
    window.location = '/home';
  }, 1500);

  return (
    <>
      <h1>Successfully logged in!</h1>
      <h2>Redirecting you to the home page...</h2>
    </>
  );
}

export default Callback;
