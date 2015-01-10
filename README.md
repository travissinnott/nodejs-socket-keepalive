# nodejs-socket-keepalive
Simple socket server and client for testing socket keepalive behavior.


# Test 1

After starting the server and client, added firewall rules to block traffic:

$ sudo iptables -A OUTPUT -p tcp --sport 7654 -j DROP
$ sudo iptables -A INPUT -p tcp --dport 7654 -j DROP


## Server:

$ node index.js -l | bunyan -l 10
[2015-01-10T22:17:09.741Z]  INFO: server/13217 on elemos: listening (port=7654, keepalive=false)
[2015-01-10T22:17:13.206Z]  INFO: server/13217 on elemos: client connected
[2015-01-10T22:17:13.210Z]  INFO: server/13217 on elemos: what? (data=hello)
[2015-01-10T22:18:22.398Z]  INFO: server/13217 on elemos: client disconnected
[2015-01-10T22:18:22.400Z]  WARN: server/13217 on elemos: socket closed! (had_error=false)
[2015-01-10T22:18:34.608Z]  INFO: server/13217 on elemos: client connected
[2015-01-10T22:18:34.613Z]  INFO: server/13217 on elemos: what? (data=hello)
^Ctravis@elemos:~/projects/nodejs-socket-keepalive$ node index.js -l | bunyan -l 10
[2015-01-10T22:19:04.282Z]  INFO: server/13664 on elemos: listening (port=7654, keepalive=false)
^[[A
[2015-01-10T22:19:42.997Z]  INFO: server/13664 on elemos: client connected
[2015-01-10T22:19:43.000Z]  INFO: server/13664 on elemos: what? (data=hello)
[2015-01-10T22:36:13.823Z] ERROR: server/13664 on elemos: 
    error: {
      "code": "ECONNRESET",
      "errno": "ECONNRESET",
      "syscall": "read"
    }
[2015-01-10T22:36:13.824Z]  WARN: server/13664 on elemos: socket closed! (had_error=true)


## Client:

$ node index.js 10.9.8.6 -k 2000 | bunyan -l 10
[2015-01-10T22:23:12.651Z] DEBUG: client/9066 on dev2: data from server
[2015-01-10T22:23:13.153Z] DEBUG: client/9066 on dev2: data from server
[2015-01-10T22:23:13.654Z] DEBUG: client/9066 on dev2: data from server
[2015-01-10T22:23:14.655Z]  WARN: client/9066 on dev2: timeout!
[2015-01-10T22:35:30.895Z] ERROR: client/9066 on dev2: 
    error: {
      "code": "ETIMEDOUT",
      "errno": "ETIMEDOUT",
      "syscall": "read"
    }
[2015-01-10T22:35:30.896Z]  WARN: client/9066 on dev2: connection closed! (had_error=true)
