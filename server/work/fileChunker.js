var fs = require('fs');
var events = require('events');
var fileChunkerEmitter = new events.EventEmitter();
var decoder = require('./decoder');
var util = require('./util');


fileChunkerEmitter.on('chunkFile',function(filePath,fileName){

    var fd = fs.openSync(filePath+fileName, 'r');

    if (fd) {
        var stats = fs.fstatSync(fd);
        var buffer = new Buffer(stats.size);
        var bytesRead = fs.readSync(fd, buffer, 0, stats.size, 0);
        for (var i = 0; i < bytesRead; i += 128) {
            decoder.decode(util.sub(buffer, i, 128),i/128,fileName);
        }
    }

    fs.close(fd);
});

exports.chunkFile = function(filePath,fileName){
    console.log ( 'chunking file: ' + fileName);
    fileChunkerEmitter.emit('chunkFile',filePath,fileName);
};