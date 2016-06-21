var events = require('events');
var decoderEmitter = new events.EventEmitter();
var util = require('./util');
var uploader = require('./uploader');
var config = require('.././config.json');

var getDate = function(line,fileName){
    fileName = fileName.replace(/(.lbd)+/g, '');
    var date = new Date(0);
    date.setYear(fileName[0] += fileName[1] += fileName[2] += fileName[3]);
    date.setMonth(fileName[4] += fileName[5] - 1);
    date.setDate(fileName[6] += fileName[7]);
    date.setSeconds((line + 1) * 10);

    if(config.logChuckDates){
        console.log(date);
    }
    return date;
};

var createWorkObj = function (temp,line,fileName, machine) {
    var obj = {
        machineName: machine.machineName,
        fileName:  fileName.replace(/(.lbd)+/g, ''),
        date: getDate(line,fileName),
        line: line,
        SPDL_FB1: util.getInt(util.sub(temp, 0x00, 2)),
        SPDL_FB2: util.getInt(util.sub(temp, 0x02, 2)),
        SPDL_FB3: util.getInt(util.sub(temp, 0x04, 2)),
        SPDL_FB4: util.getInt(util.sub(temp, 0x06, 2)),
        ATMD_ALARM: util.getByte(util.sub(temp, 0x08, 1)),
        MNMD_NA: util.getByte(util.sub(temp, 0x09, 1)),
        SGNL_SGLB: util.getByte(util.sub(temp, 0x0B, 1)),
        SGNL_CUT: util.getByte(util.sub(temp, 0x0A, 1)),
        SPDL_ROT1: util.getInt(util.sub(temp, 0x0C, 2)),
        unknown1: util.getInt(util.sub(temp, 0x0E, 2)),
        SPDL_ROT2: util.getInt(util.sub(temp, 0x10, 2)),
        unknown2: util.getInt32(util.sub(temp, 0x12, 4)),
        SPDL_ROT3: util.getInt(util.sub(temp, 0x16, 2)),
        SPDL_ROT4: util.getInt(util.sub(temp, 0x18, 2)),
        PARTS_CNT: util.getInt32(util.sub(temp, 0x1A, 4)),
        SPDL_OVRD1: util.getInt(util.sub(temp, 0x1E, 2)),
        SPDL_OVRD2: util.getInt(util.sub(temp, 0x20, 2)),
        SPDL_OVRD3: util.getInt(util.sub(temp, 0x22, 2)),
        SPDL_OVRD4: util.getInt(util.sub(temp, 0x24, 2)),
        FEED_OVRD: util.getByte(util.sub(temp, 0x26, 1)),
        RAPID_OVRD: util.getByte(util.sub(temp, 0x27, 2)),
        WNO_NO: util.getString(util.sub(temp, 0x28, 32)),
        unknown3: util.getByte(util.sub(temp, 0x48, 1)),
        WNO_ATRB: util.getByte(util.sub(temp, 0x49, 1)),
        unknown: util.getString(util.sub(temp, 0x4A, 18)),
        ALARM_ATRB: util.getInt(util.sub(temp, 0x5C, 2)),
        ALARM_NO: util.getInt(util.sub(temp, 0, 2)),
        ALARM_CODE1: util.getInt(util.sub(temp, 0, 2)),
        ALARM_CODE2: util.getInt(util.sub(temp, 0, 2)),
        ALARM_CODE3: util.getInt(util.sub(temp, 0, 2))
    };

    return obj;
};

decoderEmitter.on('decode', function(chunk,line,fileName, machine){
    doDecode(chunk,line,fileName, machine);
});

function doDecode(chunk,line,fileName, machine) {
    var workObj = createWorkObj(chunk,line,fileName, machine);
    uploader.upload(workObj, machine);
}

exports.decode = function (chunk,line, fileName, machine) {
    if(config.useEvents){
        decoderEmitter.emit('decode', chunk,line, fileName, machine);
    }else{
        doDecode(chunk,line,fileName, machine);
    }

};
