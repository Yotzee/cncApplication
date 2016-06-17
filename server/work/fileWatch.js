var events = require('events');
var fileWatch = new events.EventEmitter();
var fs = require('fs');
var path = require('path');
var decoder = require('./decoder');
var fileChunker = require('./fileChunker');
var util = require('./util');
var files = require('./.files.json');

fileWatch.on('newFile', function (filePath, fileName) {
    fileChunker.chunkFile(filePath, fileName);
});



exports.findFiles = function (filePath) {
    fs.readdir(filePath, function (err, list) {
        list.forEach(function(fileName){
            if (!(/[ldb]+/g).test(fileName)) {
                return;
            }
            var foundFile = util.findFile(files,fileName);
            var fileInfo = util.getFileInfo(filePath+fileName);

            if(foundFile){
                if(foundFile.mtime){
                    if(Date(foundFile.mtime) != Date(fileInfo.mtime)){
                        console.log('found changed file: ' +  fileName);
                        fileWatch.emit('newFile', filePath, fileName);
                        foundFile.mtime = fileInfo.mtime;
                    }
                }
            }
            else{
                var fileObj = {
                    fileName: fileName,
                    mtime: fileInfo.mtime
                };
                files.push(fileObj);
                fs.writeFile('server/work/.files.json', JSON.stringify(files), function (err) {
                    if (err) {
                        console.error('failed to write files.json');
                    }
                });
                console.log('found new file: ' +  fileName);
                fileWatch.emit('newFile', filePath, fileName);
            }


        });
    });
};