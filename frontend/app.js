const cluster = require('cluster');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const hpp = require('hpp');
const helmet = require('helmet');
const numCPUs = require('os').cpus().length;
const http = require('http');
const serverPort = process.env.PORT || 8080;

const app = express();
app.use([
  compression(),
  helmet({
    frameguard: false,
    dnsPrefetchControl: {
      allow: true,
    },
  }),
  bodyParser.urlencoded({ limit: '100kb', extended: true }),
  bodyParser.json({ limit: '100kb' }),
  hpp(),
]);

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/state', (req, res) => {
  
  res.status(200).send({ state: 'Up and running!' });
});

app.use('/', smoochRouter);
app.use('/custom', convoRouter);

const start = () => {
  http.createServer(app).listen(serverPort, () => {
    console.log(`App listening on port http://localhost:${serverPort}/`);
  });
};
const initCluster = () => {
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i += 1) {
      cluster.fork();
    }

    cluster.on('online', (worker) => {
      console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
      console.log('Starting a new worker');
      cluster.fork();
    });
  } else {
    start();
  }
};

if (process.env.NODE_ENV === 'production') {
  initCluster();
} else {
  start();
}
