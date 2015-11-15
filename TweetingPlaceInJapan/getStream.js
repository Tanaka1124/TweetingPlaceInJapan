var util = require('util');
var twitter = require('ntwitter');


//set here!
var twit = new twitter({
	 consumer_key: '',
	 consumer_secret: '',
	 access_token_key: '',
	 access_token_secret: ''
});

var keyword = process.argv[2]; //第一引数
var option = {'locations': '122.87,24.84,153.01,46.80'};
console.log(option+'を含むツイートを取得します。');

var fs = require('fs');
	var app = require('http').createServer(function(req, res) {
		switch(req.url){
			case '/':
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(fs.readFileSync('index.html'));
			break;

			case '/topo.json':
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(fs.readFileSync('topo.json'));

			break;

			case '/style.css':
				fs.readFile('./style.css', 'UTF-8',
					function (err, data) {
						res.writeHead(200, {'Content-Type': 'text/css'});
						res.write(data);
						res.end();
					}
				);
			break;
			
			case '/sample.png':
				fs.readFile('./sample.png', 'binary',
					function (err, data) {
						res.writeHead(200, {'Content-Type': 'image/png'});
						res.write(data, 'binary');
						res.end();
					}
				);
			break;

		}

	}).listen(3000);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
	 socket.on('msg', function(data) {
		io.sockets.emit('msg', data);
	});
});

twit.stream('statuses/filter', option, function(stream) {
	stream.on('data', function (data) {
		if(data.geo!=null){
			io.sockets.emit('msg', [data.geo.coordinates[1],data.geo.coordinates[0],data.user.name,data.text,data.created_at,data.user.profile_image_url]);

			console.log(data);
		}


	});
});