require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')

const app = express();

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://dev:dev123@gpscluster.xy56p.mongodb.net/dashboard1?retryWrites=true&w=majorit", {
  useNewUrlParser: true
});

mongoose.set("useCreateIndex", true);
mongoose.connection.on('open', function() {
  console.log('Connected to mongo server.');
  mongoose.connection.db.listCollections().toArray(function(err, names) {
    module.exports.Collection = names;
  });
});

const ProjectSchema = new mongoose.Schema({
  title:String,
  image:String,
  message:String
});

const AnnouncementSchema = new mongoose.Schema({
  region:String,
  name:String,
  country:String,
  city:String,
  noOfResources:Number,
  startDate:String,
  endDate:String,
  image:String,
  links: {
    link1: String,
    link2: String
  }
});

const Project = mongoose.model("Project",ProjectSchema);
const Announcement = mongoose.model("Announcement",AnnouncementSchema);

app.get("/projects", function(req, res) {
  Project.find({},function(err,values){
    res.send(values);
  });
});

app.get("/projects/:projectName", function(req, res) {
  const projectName = req.params.projectName;
  Project.find({region: projectName},function(err,values){
    res.send(values);
  });
});

app.get("/announcements", function(req, res) {
  Announcement.find({},function(err,values){
    res.send(values);
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9000;
}
app.listen(port, function() {
  console.log("connected");
});
