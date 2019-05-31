const { PORT, DATABASE_CONNECTION_STRING } = process.env;

export default {
  server: {
    PORT: PORT || 8000,
  },
  database: {
    CONNECTION_URL: DATABASE_CONNECTION_STRING || 'mongodb://localhost:27017/issues-tracker',
  },
};
