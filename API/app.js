import bodyParser from 'body-parser';
import Debug from 'debug';
import express from 'express';
import expressValidator from 'express-validator';
import { config } from 'dotenv';
import allRoutes from 'express-list-endpoints';
import swaggerUi from 'swagger-ui-express';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import specs from '../swaggerDoc';
import router from './routes';
import validateMiddleware from './middlewares/validateMiddleware';

config();
const app = express();
const logger = new Debug('dev');
const { PORT = 4000 } = process.env;
const { methodNotAllowed, pageNotFound } = validateMiddleware;

const allowedOrigins = ['http://localhost', '127.0.0.1', 'http://localhost:5500', '127.0.0.1:5500', 'http://127.0.0.1:5500',
  'https://conquext.github.io', 'https://property-pro-lite1.herokuapp.com'];

app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cors({
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': ['Origin', 'Content-Type', 'Accept'],
  'Access-Control-Allow-Methods': ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  'Access-Control-Allow-Origin': ['http://localhost:5500'],
  Vary: 'origin',
  credentials: true,
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not '
                + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));

const API_VERSION = '/api/v1';

const swaggerOptions = {
  customSiteTitle: 'My Service',
  customCss: '.swagger-ui .topbar { display: none }',
};

app.use(fileupload({
  useTempFiles: true,
}));

app.use(`${API_VERSION}/`, router);

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json(specs);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: false, swaggerOptions }));

const endpoints = allRoutes(app);
const endPointsPaths = [];
for (let i = 0; i < endpoints.length; i++) {
  endPointsPaths[i] = endpoints[i].path;
}

const sendError = (req, res, next) => {
  try {
    let flag = true;
    if (endPointsPaths.includes(req.path)) {
      for (let i = 0; i < router.stack.length; i++) {
        if (req.method !== router.stack[i].method) {
          flag = false;
        }
      }
      if (!flag) {
        methodNotAllowed(req, res);
        next();
      }
    } else {
      pageNotFound(req, res);
      next();
    }
  } catch (err) {
    //
  }
};

app.all('*', (req, res) => {
  sendError(req, res);
});

app.listen(PORT, () => {
  logger(`Server is running on PORT ${PORT}`);
});

export default app;
