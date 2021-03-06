var fs = require('fs');
var events = require('events');
var fileChunkerEmitter = new events.EventEmitter();
var decoder = require('./decoder');
var util = require('./util');
var config = require('../config.json');

function doChunkFile(filePath, fileName, machine) {

    var fd = fs.openSync(filePath + fileName, 'r');

    if (fd) {
        var stats = fs.fstatSync(fd);
        var buffer = new Buffer(stats.size);
        var bytesRead = fs.readSync(fd, buffer, 0, stats.size, 0);
        for (var i = 0; i < bytesRead; i += 128) {
            decoder.decode(util.sub(buffer, i, 128), i / 128, fileName, machine);
        }
    }

    fs.close(fd);
}

fileChunkerEmitter.on('chunkFile', function (filePath, fileName, machine) {
    doChunkFile(filePath, fileName, machine);
});

exports.chunkFile = function (filePath, fileName, machine) {
    console.log('chunking file: ' + fileName);
    if (config.useEvents) {
        fileChunkerEmitter.emit('chunkFile', filePath, fileName, machine);
    } else {
        doChunkFile(filePath, fileName, machine);
    }
};