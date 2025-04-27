const app = require('./app');

const port = 3000;

app.listen(port, () => {
  console.log(`Dashboard server is online and running on port ${port}`);
});