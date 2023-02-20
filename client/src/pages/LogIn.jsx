import React from 'react';

function LogIn() {
  return (
    <div className='App'>
      <h1>SpotifAI</h1>
      <h2>AI-powered playlist generator</h2>
      <button
        onClick={async () => {
          const response = await fetch('/api/get-auth-url');
          window.location = (await response.json()).url;
        }}
      >
        LOG IN WITH SPOTIFY
      </button>
    </div>
  );
}

export default LogIn;
