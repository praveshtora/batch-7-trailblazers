import mongoose from 'mongoose';
import config from './index';

export default {
  async connectDB(onError) {
    let db;
    try {
      const { CONNECTION_URL } = config.database;
      db = await mongoose.connect(CONNECTION_URL, { useNewUrlParser: true });
    } catch (exception) {
      console.log(exception);
      onError();
    }
    return db;
  },
  disconnectDB() {
    mongoose.connection.close();
  },
};
