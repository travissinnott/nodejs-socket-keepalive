var args = require("minimist")(process.argv.slice(2));
var default_port = 7654;

/* Start server if listen parameter is specified */
if (args.l || args.listen) {
	var server = require("./server")({
		port: args.l || args.listen || default_port, 
		keepalive: args.k || args.keepalive
	});
}

/* Connect to remote server if host specified */
if (args._.length > 0) {
	var client = require("./client")({
		host: args._[0],
		port: args.p || args.port || default_port,
		keepalive: args.k || args.keepalive
	});
}