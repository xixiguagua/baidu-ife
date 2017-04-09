var http = require('http');
var url = require('url');
var exec = require('child_process').exec;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/baiduife');

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function (callback){
	console.log('mongoose started');
});

var resultSchema = new mongoose.Schema({
	code: Number,
	msg: String,
	device: String,
	time: Number,
	datalist:[{
		title: String,
		info:String,
		link:String,
		pic:String
	}]
});

var result = mongoose.model('Result',resultSchema);

http.createServer(function (req,res){
	if(req.url !=='/favicon.ico') {
		console.log('request received');
		var queryObj = url.parse(req.url,true).query;
		exec('phantomjs task2.js '+phantom+' '+iphone5,function (err,stdout,stderr){
			if(err) {
				console.log(err);
			} else {
				try {
					JSON.parse(stdout);
				} catch(e) {
					res.writeHead(200,{'Content-Type':'application/json'});
					return res.end(JSON.stringify({code:0,msg:'检查参数'}));
				}
				var results = new result(JSON.parse(stdout));
				res.writeHead(200,{'Content-Type':'application/json'});
				res.end(stdout);
				results.save(function (err,result){
					if(err) console.log(err);
					else console.log(results);
				});
			}
		});
	}
}).listen(8080);
console.log('server started');