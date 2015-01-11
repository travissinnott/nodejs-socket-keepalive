var net = require("net");
var bunyan = require("bunyan");
var log = bunyan.createLogger({name: "client", level: "debug"});

module.exports = function(opts){
	opts = opts || {};
	opts.host = opts.host || "localhost";
	opts.port = parseInt(opts.port) || 7654;
	opts.keepalive = false || parseInt(opts.keepalive);

	var client = net.connect(opts, function(){
		if (false !== opts.keepalive) {
			log.info({keepalive: opts.keepalive}, 
				"Will attempt to keep connection alive!");
			client.setKeepAlive(true, 0); //, opts.keepalive);
		}

		// 'connect' listener
		log.info(opts, "connected.");
		client.write("hello");
	});

	client.on("connect", function(){
		log.info("Other connect listener");
	});

	client.on("data", function(data){
		log.debug("data from server");
		log.trace({"data":data.toString()});
	});
	client.on("end", function(){
		log.info("connection ended.");
	});
	client.on("timeout", function(){
		log.warn("timeout!");
	});
	client.on("close", function(had_error){
		log.warn({"had_error": had_error}, "connection closed!");
	});
	client.on("error", function(e){
		log.error({"error":e});
	});

	// Timeout if no communication for 3 seconds
	//client.setTimeout(3000);

	return client;
}