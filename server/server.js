var express = require('express');
var app = express();

var decoder = require('./work/decoder');
var fileWatch = require('./work/fileWatch');
var config = require('./config');
var log4js = require('log4js');
log4js.configure(config.loggerConfig);

var main = function(){

    console.log('-------------------------------');
    console.log('searching for new/changed files');
    console.log('-------------------------------');

    config.machines.forEach(function(machine){
        fileWatch.findFiles(machine);
    });


    setTimeout(main,config.rateInMillis);
};
main();
