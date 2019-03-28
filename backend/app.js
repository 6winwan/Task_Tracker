const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const postsRoutes = require('./routes/posts')

const app = express();

// MongoDb connect
mongoose.connect("mongodb+srv://6winwan:" +
process.env.MONGO_ATLAS_PW +
"@cluster0-rggwu.mongodb.net/node-angular?retryWrites=true", { useNewUrlParser: true })
  .then(()=> {
    console.log('Connected to databse');
  }).catch((e)=>{
    console.log(e);
  })

// Add middleware
app.use(bodyParser.json());

// setHeader for CORS(Cross Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE, OPTIONS"
  );
  next();
})

app.use("/api/posts", postsRoutes);

module.exports = app;
