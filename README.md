
[![Build Status](https://secure.travis-ci.org/soldair/printastic.png)](http://travis-ci.org/soldair/printastic)

printastic
==========

printastic printing server. sends pdf files from spool directories to remote printers via printastic-printer client processes.


example
-------
```js

var printastic =  require('printastic');

var server = printastic(config);

server.listen(port);

```

install
-------

```sh

$> npm install -g printastic
$> printastic
server starts

```

config
------

secret

maxBufferSize

spools


design notes for printastic
---------------------------
printastic
  fs watching
  client connection managment
  action delegation

printastic-protocol
  duplex stream
  protocol parsing
  auth
  file streams
  

printastic-client
  connects to printastic servers
  runs ghostscript to print files sent
  runs on windows/linux




