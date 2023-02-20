// Environment variables setup
import dotenv from 'dotenv';
dotenv.config();

// Express app setup
import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// MongoDB setup
// import mongoose from 'mongoose';
// mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://127.0.0.1:27017/SpotifAI');
// mongoose.connection.on('error', (error) => {
//   console.log(`Mongo DB Connection Error: ${error}`);
// });

// OpenAI API setup
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: `Hello from SpotifAI!` });
});

app.get('/api/get-auth-url', async (req, res) => {
  const params = new URLSearchParams();
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public',
  ];

  params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
  params.append('response_type', 'token');
  params.append('redirect_uri', 'http://localhost:5173/callback');
  params.append('scope', scopes.join(' '));

  res.status(200).json({
    url: `https://accounts.spotify.com/authorize?${params.toString()}`,
  });
});

app.post('/api/openai', async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured',
      },
    });
    return;
  }

  const input = req.body.input || '';
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid input',
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `
      Recommend a playlist of ten songs that match the given description. 
      Each song should be numbered and include the artist and release year.
      Description: ${input} 
      Playlist:`,
      temperature: 1,
      max_tokens: 1024,
    });
    console.log(completion.data.choices);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
