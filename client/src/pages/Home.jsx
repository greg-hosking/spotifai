import React, { useState, useEffect } from 'react';

function Home() {
  const [name, setName] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    async function fetchName() {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      setName(data.display_name);
    }
    fetchName();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setResult('');
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setInput('');
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <>
      {name !== '' && (
        <h2 style={{ position: 'absolute', top: '5px', left: '20px' }}>
          <span>
            <a href='/'>X</a>
          </span>
          &nbsp; Signed in as {name}
        </h2>
      )}
      <h1>Describe the playlist you want...</h1>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          name='input'
          placeholder='Enter playlist description'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={isLoading} type='submit' value='Submit'>
          {isLoading ? 'LOADING' : 'SUBMIT'}
        </button>
      </form>

      <h3>{result}</h3>
    </>
  );
}

export default Home;
