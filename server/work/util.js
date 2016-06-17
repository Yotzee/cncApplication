var fs = require('fs');

exports.getFileInfo = function (path) {
    return fs.statSync(path);
};

exports.findFile = function(filesJson, file) {
    for (var i = 0; i < filesJson.length; i++) {
        if (filesJson[i].fileName === file) {
            return filesJson[i];
        }
    }
    return filesJson[i];
};

exports.getFilesInDir = function(dir){
    return new Promise(function(resolve,reject){
        try{
            fs.readdir(dir, function (err, list) {
                resolve(list);
            });
        }catch(err){
            console.log('Error getting files' + err);
            reject(err);
        }
    });
}
exports.getString = function(data) {
    var buf = new Buffer(data);
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i] === 0) {
            count = i;
        }
    }
    return buf.toString('ascii', 0, count).replace(/\0/g, '');
};

exports.getInt32 = function(data) {
    var buf = new Buffer(data);
    return buf.readInt32LE(0);
};

exports.getInt = function(data) {
    var buf = new Buffer(data);
    return buf.readInt16LE(0);
};

exports.getByte = function(data) {
    var buf = new Buffer(data);
    return buf.readInt8(0);
};

exports.sub = function (data, start, finish) {
    var d = [];
    finish = start + finish;
    for (var i = start; i < finish; i++) {
        if (finish > data.length) {
            break;
        }
        d.push(data[i]);
    }
    return d;
};