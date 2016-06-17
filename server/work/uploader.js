var events = require('events');
var uploadEmitter = new events.EventEmitter();
var sql = require('mssql');
var config = require('.././config.json');
var sqlServerConfig = config.sqlServerConfig;

uploadEmitter.on('uploadMSSQL',function(workObj){

});

uploadEmitter.on('uploadSQLITE',function(workObj){
    
});

exports.upload = function(workObj){
    if(config.userSqLite){
        uploadEmitter.emit('uploadSQLITE',workObj);
    }else{
        uploadEmitter.emit('uploadMSSQL',workObj);
    }
};