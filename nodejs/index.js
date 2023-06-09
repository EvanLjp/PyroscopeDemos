/* eslint-disable */
const Pyroscope = require('@pyroscope/nodejs');

const port = process.env['PORT'] || 3000;

const region = process.env['REGION'] || 'default';
const appName = process.env['PYROSCOPE_APP_NAME'] || 'default';
const hostname = process.env['HOSTNAME'] || 'default';
const version = '1.1';
const environment = 'test';

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.send('Available routes are: /bike, /car, /scooter');
});

const genericSearchHandler = (p) => (req, res) => {
  const time = +new Date() + p * 1000;
  let i = 0;
  while (+new Date() < time) {
    i = i + Math.random();
  }
  res.send('Vehicle found');
};

Pyroscope.init({
  appName: 'nodejs',
  serverAddress: process.env['PYROSCOPE_SERVER'] || 'http://pyroscope:4040',
  tags: { hostname, version, environment },
});

Pyroscope.startCpuProfiling();
Pyroscope.startHeapProfiling();

app.get('/bike', function bikeSearchHandler(req, res) {
  return genericSearchHandler(0.5)(req, res);
});
app.get('/car', function carSearchHandler(req, res) {
  return genericSearchHandler(1)(req, res);
});
app.get('/scooter', function scooterSearchHandler(req, res) {
  return genericSearchHandler(0.25)(req, res);
});

app.listen(port, () => {
  console.log(
    `Server has started on port ${port}, use http://localhost:${port}`
  );
});
