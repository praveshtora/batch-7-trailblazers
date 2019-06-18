const {
  PORT,
  DATABASE_CONNECTION_STRING,
  SESSION_SECRET,
  INVITATION_EMAIL_SENDER,
  INVITATION_EMAIL_PASSWORD,
} = process.env;

export default {
  server: {
    PORT: PORT || 8000,
  },
  database: {
    CONNECTION_URL: DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/issues-tracker',
  },
  session: {
    SECRET: SESSION_SECRET || '45df84gx5',
  },
  emailService: {
    INVITATION_EMAIL_PASSWORD,
    INVITATION_EMAIL_SENDER,
  },
};
