var events = require('events');
var fileWatch = new events.EventEmitter();
var fs = require('fs');
var path = require('path');
var decoder = require('./decoder');
var fileChunker = require('./fileChunker');
var util = require('./util');
var config = require('../config.json');


fileWatch.on('newFile', function (filePath, fileName) {
    doFileWatch(filePath, fileName);
});

function doFileWatch(filePath, fileName) {
    fileChunker.chunkFile(filePath, fileName);
}

exports.findFiles = function (filePath) {
    try{
        var files = require('./.files.json');
        // var files = fs.readFileSync(process.env.PWD + '/server/work/.files.json', "utf8")
    }catch(err){
        files = [];
    }

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
                        if(config.useEvents){
                            fileWatch.emit('newFile', filePath, fileName);
                        }else{
                            doFileWatch(filePath,fileName);
                        }

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
                if(config.useEvents){
                    fileWatch.emit('newFile', filePath, fileName);
                }else{
                    doFileWatch(filePath,fileName);
                }
            }
        });
    });
};