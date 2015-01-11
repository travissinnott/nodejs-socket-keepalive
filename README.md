# nodejs-socket-keepalive

This project was created to explore the behavior of the setKeepAlive() option on sockets in Node.js.  Use the server and client to test KeepAlive behavior from both ends.  Use different machines and/or firewall rules to simulate network failure. 

## Backstory

There was once a bizarre foreign network that was oddly unreliable. Inexplicable silent connection failure was difficult to detect on a low-traffic TCP socket.  Humans could smell failure before the software!  What were we to do?

The IETF to the rescue with RFC 1122 Section 4.2.3.6: TCP Keep-Alives! 

Alas, Node.js, as with many programming languages, only allows the developer to turn it on or off, and leaves all configuration and control to the underlying OS.  RFC1122 fails to define requirements, so every OS has different options and behavior.

# Notes using Keep-Alive with Node.js on Linux

## setKeepAlive() calls the underlying OS socket KEEPALIVE behavior.

TCP Keep-Alive behavior is implemented at the OS layer.  Node.js will trigger this behavior when `setKeepAlive(true)` is called on a socket object created from the `net.connect()` call.

## Linux Keep-Alive Configuration

Read the HOWTO http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/usingkeepalive.html


## setKeepAlive() ignores initialDelay if called before connecting.

Example: Set KeepAlive on the socket after 5000ms of inactivity.

```
var socket = net.connect(opts, function(){
    // 'connect' listener
	socket.setKeepAlive(true, 5000);
	socket.write("hello");
});
```

Incorrect:

```
var socket = net.connect(opts, function(){
    // 'connect' listener
	socket.write("hello");
});
socket.setKeepAlive(true, 5000);
```

This will still kick in the keepalive bahavior, but using a default initialDelay of 30 seconds.


# TODO

- [ ] Add script for running
- [ ] Add command line help
- [ ] Document basic use


# Simulating network failure with iptables

These rules were added to the server after starting the server and client.

```
$ sudo iptables -A OUTPUT -p tcp --sport 7654 -j DROP
$ sudo iptables -A INPUT -p tcp --dport 7654 -j DROP
```

# References

https://tools.ietf.org/html/rfc1122#section-4.2.3.6
https://tools.ietf.org/html/rfc1122#page-101
https://github.com/joyent/node/issues/4109#issuecomment-9404446
