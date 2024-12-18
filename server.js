const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

//db
const db = process.env.DB_URL.replace(
  '<db_username>',
  process.env.DB_USERNAME
).replace('<db_password>', process.env.DB_PASSWORD);

mongoose.set('strictQuery', true);

mongoose
  .connect(db)
  .then(() => console.log('Database Connected ✅'))
  .catch((err) => console.log('Database connection error 🚫', err));

//listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port: ${port}`));
