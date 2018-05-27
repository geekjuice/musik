try {
  require('dotenv').config();
} catch (error) {} // eslint-disable-line no-empty

const {
  env: {
    NODE_ENV,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
  },
} = process;

export {
  NODE_ENV,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
};
