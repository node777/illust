const express = require('express');

const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static("www"));

process.env.PORT=1337;
 
app.listen(process.env.PORT, () =>
  console.log(`illust serving on port ${process.env.PORT}!`),
);