const { app, port } = require('./app');

app.listen(port, () => {
  console.log(`Dashboard server is online and running on port ${port}`);
});
