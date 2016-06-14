var express = require('express');
var app = express();
//var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
//var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://ace:123456@ds013414.mlab.com:13414/vast';
mongoose.connect(url);
var db = mongoose.connection;
db.once('open',function(){
   console.log("connected");
});
var haz_schema = new Schema({
    f2z2: String,
    flz8a: String,
    f3z1: String,
    f2z4: String,
    time: Number
},{
  collection: 'haz_data'
});
var haz_data = mongoose.model('haz_data',haz_schema);
app.get('/haz_data',function(req,res){
    haz_data.find(function(err,haz){
        if(err)
            res.send("error");
        else{
            console.log(haz);
            res.json(haz);
        }
    })
});
app.get('/', function(req, res){
    res.send('hello world');
});
app.listen(1337, function(){
    console.log('Example app listening on port 1337!');
});