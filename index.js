var args = require("minimist")(process.argv.slice(2));
var default_port = 7654;

if (args.l || args.listen) {
	var server_port = parseInt(args.l) || default_port;
	var server = require("./server")({
		port: server_port, 
		keepalive:parseInt(args.k || args.keepalive) || false
	});
}

if (args._.length > 0) {
	var port = parseInt(args.p) || default_port;
	console.log("Connecting to "+args._[0]+" port "+port);
}