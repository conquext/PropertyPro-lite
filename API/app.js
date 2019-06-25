import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => res.send(`The app is running at port:${PORT}`));

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
  
export default app;