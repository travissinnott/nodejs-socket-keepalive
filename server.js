var net = require("net");
var bunyan = require("bunyan");
var log = bunyan.createLogger({name: "server", level: "debug"});

module.exports = function(opts){
	opts = opts || {};
	opts.port = parseInt(opts.port) || 7654;
	opts.keepalive = parseInt(opts.keepalive) || false;

	var server = net.createServer(function(socket){
		log.info("client connected");

		/* Handle and log all events */
		socket.on("connect", function(){
			// "connect" event is never triggered in server
			log.info("connect event");		
		});
		socket.on("data", function(buf){
			log.info({data:buf.toString()}, "what?");
		});
		socket.on("end", function(){
			log.info("client disconnected");
		});
		socket.on("timeout", function(){
			log.warn("timeout!");
		});
		socket.on("close", function(had_error){
			log.warn({"had_error": had_error}, "socket closed!");
			clearInterval(running);
			running = false;
		});
		socket.on("error", function(e){
			log.error({"error":e});
		});

		// Send time every 250ms
		var running = setInterval(function(){
			socket.write((new Date()).getTime().toString());
		}, 500);

		// Stop sending time after 10s
		setTimeout(function(){
			if (running) {
				clearInterval(running);
				running = false;
				log.info("stopped sending data");
			}
		}, 5000);

		// Timeout if no communication for 3 seconds
		socket.setTimeout(3000);

		if (opts.keepalive) {
			log.info({keepalive: opts.keepalive}, 
				"Will attempt to keep connection alive!");
			socket.setKeepAlive(true, opts.keepalive);
		}

	});

	server.listen(opts.port, function(){
		log.info(opts, "listening");
	});

	return server;
}