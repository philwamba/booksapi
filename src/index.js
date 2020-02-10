const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const bookRouter = require('./routes/book');
const db = require('./helpers/db');

const app = express();

db.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.log(error);
});
// eslint-disable-next-line no-console
db.once('open', () => console.log('Connected to database!'));

app.use(cors());
app.use(morgan('common'));
app.use(helmet());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  const response = { msg: 'Hello there 👋' };
  res.json(response);
});

app.use('/api/v1', bookRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost/${port}`);
});
