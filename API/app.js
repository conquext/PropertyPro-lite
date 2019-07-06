import bodyParser from 'body-parser';
import Debug from 'debug';
import express from 'express';
import expressValidator from 'express-validator';
import path from 'path';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import specs from '../swaggerDoc';
import authRouter from './routes/authRouter';
import propertyRouter from './routes/propertyRouter';

config();
const app = express();
const logger = new Debug('dev');
const { PORT = 4000 } = process.env;

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

const API_VERSION = '/api/v1';
const swaggerOptions = {
  customSiteTitle: 'My Service',
  customCss: '.swagger-ui .topbar { display: none }',
};


app.use(`${API_VERSION}/auth`, authRouter);
app.use(`${API_VERSION}/property`, propertyRouter);

app.use('/', express.static(path.resolve(__dirname, '')));
app.use('/static', express.static('public'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: false, swaggerOptions }));

app.get('/', (req, res) => res.send(`The app is running at port:${PORT}`));

app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json(specs);
});

app.get(`${API_VERSION}/auth`, (req, res) => {
  res.status(200).json({
    status: 200,
    success: 'true',
    message: 'Welcome to PropertyPro-lite',
  });
});

app.listen(PORT, () => {
  logger(`Server is running on PORT ${PORT}`);
});

export default app;
