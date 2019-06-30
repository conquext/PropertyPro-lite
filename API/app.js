import bodyParser from 'body-parser';
import express from 'express';
import expressValidator from 'express-validator';
import path from 'path';
import authRouter from './routes/authRouter';
import propertyRouter from './routes/propertyRouter';


const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());
app.use(expressValidator({
  customValidators: {
    isImage(value, filename) {
      const extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        default:
          return false;
      }
    },
  },
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/property', propertyRouter);

app.use('/', express.static(path.resolve(__dirname, '')));

app.get('/', (req, res) => res.send(`The app is running at port:${PORT}`));

app.get('/api/v1/auth', (req, res) => {
  res.status(200).json({
    status: 200,
    success: 'true',
    message: 'Welcome to PropertyPro-lite',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

export default app;
