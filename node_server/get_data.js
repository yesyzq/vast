/**
 * Created by Xinnan on 6/13/2016.
 */
var express = require('express');
var app = express();
var mongodb = require('mongodb');
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://ace:123456@ds013414.mlab.com:13414/vast';
app.listen(1337, function(){
    console.log('Example app listening on port 1337!');
});
mongodb.connect(url,function(err,db){
    if(err)
        console.log("connection fails");
    else
        console.log("connection success");
    app.get('/haz_data/:start/:end',function(req,res){
        var collection = db.collection('haz_data');
        collection.find({"time":{"$gt":Number(req.params.start)},"time":{"$lt":Number(req.params.end)}}).toArray(function (err,result) {
            if(err)
                res.send(err);
            else{
                //res.setHeader('Content-Type', 'application/json');
                //res.send(JSON.stringify(result));
				res.send(result)
            }
        });
    });
    app.get('/', function(req, res){
        res.send('hello world');
    });
});


