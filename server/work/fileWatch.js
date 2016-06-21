var events = require('events');
var fileWatch = new events.EventEmitter();
var fs = require('fs');
var path = require('path');
var decoder = require('./decoder');
var fileChunker = require('./fileChunker');
var util = require('./util');
var config = require('../config.json');
try {
    var files = require('./.files.json');
    // var files = fs.readFileSync(process.env.PWD + '/server/work/.files.json', "utf8")
} catch (err) {
    files = [];
}

fileWatch.on('newFile', function (filePath, fileName) {
    doFileWatch(filePath, fileName);
});

function doFileWatch(filePath, fileName, machine) {
    fileChunker.chunkFile(filePath, fileName, machine);
}

exports.findFiles = function (machine) {
    var filePath = machine.fileDirectory;
    fs.readdir(filePath, function (err, list) {
        list.forEach(function (fileName) {
            if (!(/[ldb]+/g).test(fileName)) {
                return;
            }
            var foundFile = util.findFile(files, filePath + fileName);
            var fileInfo = util.getFileInfo(filePath + fileName);

            if (foundFile) {
                if (foundFile.mtime) {
                    if (Date(foundFile.mtime) != Date(fileInfo.mtime)) {
                        console.log('found changed file: ' + fileName);
                        if (config.useEvents) {
                            fileWatch.emit('newFile', filePath, fileName);
                        } else {
                            doFileWatch(filePath, fileName, machine);
                        }

                        foundFile.mtime = fileInfo.mtime;
                    }
                }
            }
            else {
                var fileObj = {
                    fileName: filePath + fileName,
                    mtime: fileInfo.mtime
                };
                files.push(fileObj);
                fs.writeFile('server/work/.files.json', JSON.stringify(files), function (err) {
                    if (err) {
                        console.error('failed to write files.json');
                    }
                });
                console.log('found new file: ' + fileName);
                if (config.useEvents) {
                    fileWatch.emit('newFile', filePath, fileName);
                } else {
                    doFileWatch(filePath, fileName, machine);
                }
            }
        });
    });
};