const express = require("express");
const fileUpload = require("express-fileupload");
const uploadController = require('./controllers/uploadController');
const downloadController = require('./controllers/downloadController');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './client/public/uploads/')
  },
  filename: function (req, file, cb) {
      const datetimestamp = Date.now(); 
      cb(null, file.fieldname) 
  } 
});

const upload = multer({ //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
      const ext = path.extname(file.originalname);
      if(ext !== '.csv') {
          return callback(new Error('Only allowed CSV'))
      }
      callback(null, true)
  }
}).single('file');

const connectDB = async () => {
  try {
    mongoose.connect('mongodb://localhost:27017/usersdb');
    const connection = mongoose.connection;
    connection.once('open', () => {
      console.log("MongoDB database connection established successfully");
    });
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

const app = express();


// Upload endpoint
// app.post("/upload", upload, uploadController);
app.use(fileUpload());

app.post("/upload", uploadController);
app.get("/files/:filename", downloadController);

app.listen(5000, () => console.log("Server started..."));
