const express = require('express');
require('dotenv').config();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');

const bodyParser = require('body-parser');
const connectToMongo = require('./db/connection');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();
const port = process.env.NODE_LOCAL_PORT || 3000;

app.use(bodyParser.json());

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: "Let's Share API with Swagger",
    version: '0.1.0',
    description: "Let's Share API documentation with Swagger",
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  host: 'localhost:3000', // the host or url of the app
};
// options for the swagger docs
const options = {
  definition: swaggerDefinition,
  // apis: ['./docs/**/*.yaml'],
  apis: [`${__dirname}/routes/auth.js`],
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// use swagger-Ui-express for app documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: "Hello Let's Share!" });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    connectToMongo();
  });
}

module.exports = app;
