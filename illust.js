const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const unzipper = require('unzipper');
const _ = require('lodash');
const fs = require("fs");
const crypto =require('crypto');

const app = express();
const hashList={};
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static("www"));

app.get('/models', (req, res) => {
  return res.send(JSON.stringify(hashList));
});
app.get('/models/:model', (req, res) => {
  res.sendFile(__dirname + `/www/assets/models/${req.params.model}/scene.gltf`);
});
app.post('/upload', async (req, res) => {
  console.log(req.files);
  console.log(req.body);
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          try{
          let info = JSON.parse(req.body.info);
          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
          let m = req.files.model;
          
          var h=crypto.createHash('sha256');
          h.update(m.data);
          let ha=h.digest('hex');

          //Use the mv() method to place the file in upload directory 
          hashList[ha]={info};
          //m.mv('./www/assets/models/' + ha +'.gltf');
          fs.createReadStream(m)
          .pipe(unzipper.Extract({ path: `./www/assets/models/${ha}` }));
          //send response
          res.send({
              status: true,
              message: `File uploaded successfully:\n\nHash: ${ha}`
          });
        }catch(e){
          res.send({
              status: false,
              message: `File could not be uploaded:\n\nRecieved following error: ${e}`
          });
        }
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

//start app 
const port = process.env.PORT || 5111;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);