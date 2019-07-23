import bodyParser from 'body-parser';
import Debug from 'debug';
import express from 'express';
import expressValidator from 'express-validator';
import path from 'path';
import { config } from 'dotenv';
import allRoutes from 'express-list-endpoints';
import swaggerUi from 'swagger-ui-express';
import specs from '../swaggerDoc';
import router from './routes';
import validateMiddleware from './middlewares/validateMiddleware';

config();
const app = express();
const logger = new Debug('dev');
const { PORT = 4000 } = process.env;
const { methodNotAllowed, pageNotFound } = validateMiddleware;

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

const API_VERSION = '/api/v1';

const swaggerOptions = {
  customSiteTitle: 'My Service',
  customCss: '.swagger-ui .topbar { display: none }',
};

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
