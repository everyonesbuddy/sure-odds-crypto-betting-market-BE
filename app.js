const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const errController = require('./controllers/errController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '5mb' }));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  })
);

// Routes
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.use(errController);

app.use('*', (req, res) => {
  res.status(404).send('route does not exist');
});

module.exports = app;
