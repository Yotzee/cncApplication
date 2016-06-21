var events = require('events');
var uploadEmitter = new events.EventEmitter();
var fs = require('fs');
var sql = require('mssql');
var config = require('.././config.json');
var sqlServerConfig = config.sqlServerConfig;

uploadEmitter.on('uploadMSSQL', function (workObj, machine) {
    doUpload(workObj);
});

function doUpload(workObj, machine) {

    sql.connect(sqlServerConfig).then(function () {
        var query = '';
        query += 'INSERT INTO [dbo].[workItems] ([machineId],[date],[SPDL_FB1],[SPDL_FB2],[SPDL_FB3],[SPDL_FB4],[ATMD_ALARM],[MNMD_NA],[SGNL_SGLB],[SGNL_CUT],[SPDL_ROT1],[unknown1],[SPDL_ROT2],[unknown2],[SPDL_ROT3],[SPDL_ROT4],[PARTS_CNT],[SPDL_OVRD1],[SPDL_OVRD2],[SPDL_OVRD3],[SPDL_OVRD4],[FEED_OVRD],[RAPID_OVRD],[WNO_NO],[unknown3],[WNO_ATRB],[unknown],[ALARM_ATRB],[ALARM_NO],[ALARM_CODE1],[ALARM_CODE2],[ALARM_CODE3] VALUES(';
        query += workObj.machineName + ',';
        query += workObj.date + ',';
        query += workObj.SPDL_FB1 + ',';
        query += workObj.SPDL_FB2 + ',';
        query += workObj.SPDL_FB3 + ',';
        query += workObj.SPDL_FB4 + ',';
        query += workObj.ATMD_ALARM + ',';
        query += workObj.MNMD_NA + ',';
        query += workObj.SGNL_SGLB + ',';
        query += workObj.SGNL_CUT + ',';
        query += workObj.SPDL_ROT1 + ',';
        query += workObj.unknown1 + ',';
        query += workObj.SPDL_ROT2 + ',';
        query += workObj.unknown2 + ',';
        query += workObj.SPDL_ROT3 + ',';
        query += workObj.SPDL_ROT4 + ',';
        query += workObj.PARTS_CNT + ',';
        query += workObj.SPDL_OVRD1 + ',';
        query += workObj.SPDL_OVRD2 + ',';
        query += workObj.SPDL_OVRD3 + ',';
        query += workObj.SPDL_OVRD4 + ',';
        query += workObj.FEED_OVRD + ',';
        query += workObj.RAPID_OVRD + ',';
        query += workObj.WNO_NO + ',';
        query += workObj.unknown3 + ',';
        query += workObj.WNO_ATRB + ',';
        query += workObj.unknown + ',';
        query += workObj.ALARM_ATRB + ',';
        query += workObj.ALARM_NO + ',';
        query += workObj.ALARM_CODE1 + ',';
        query += workObj.ALARM_CODE2 + ',';
        query += workObj.ALARM_CODE3 + ');';
        console.log(query);

    }).catch(function (err) {
        //console.log(err);
    });
}

exports.upload = function (workObj, machine) {

    if (config.outputCSVFIle) {
        //uploadEmitter.emit('outputCSV', workObj);
        exports.outputCSV(workObj, machine);
    }
    else {
        if (config.useEvents) {
            uploadEmitter.emit('uploadMSSQL', workObj, machine);
        } else {
            doUpload(workObj, machine);
        }
    }
};

exports.outputCSV = function (workObj, machine) {
    var file = 'output/' + machine.machineName + '.' + workObj.fileName + '.csv';
    var data = '';
    if (workObj.line == 0) {
        try {
            fs.statSync(file).isFile();
            fs.unlinkSync(file)
            var header = 'MachineName,DateMS,SPDL_FB1,SPDL_FB2,SPDL_FB3,SPDL_FB4,ATMD_ALARM,MNMD_NA,SGNL_SGLB,SGNL_CUT,SPDL_ROT1,unknown1,SPDL_ROT2,unknown2,SPDL_ROT3,SPDL_ROT4,PARTS_CNT,SPDL_OVRD1,SPDL_OVRD2,SPDL_OVRD3,SPDL_OVRD4,FEED_OVRD,RAPID_OVRD,WNO_NO,unknown3,WNO_ATRB,unknown,ALARM_ATRB,ALARM_NO,ALARM_CODE1,ALARM_CODE2,ALARM_CODE3\r\n';
            fs.appendFileSync(file, header);
        } catch (err) {

        }
    }

    data += workObj.machineName += ',';
    data += workObj.date += ',';
    data += workObj.SPDL_FB1 += ',';
    data += workObj.SPDL_FB2 += ',';
    data += workObj.SPDL_FB3 += ',';
    data += workObj.SPDL_FB4 += ',';
    data += workObj.ATMD_ALARM += ',';
    data += workObj.MNMD_NA += ',';
    data += workObj.SGNL_SGLB += ',';
    data += workObj.SGNL_CUT += ',';
    data += workObj.SPDL_ROT1 += ',';
    data += workObj.unknown1 += ',';
    data += workObj.SPDL_ROT2 += ',';
    data += workObj.unknown2 += ',';
    data += workObj.SPDL_ROT3 += ',';
    data += workObj.SPDL_ROT4 += ',';
    data += workObj.PARTS_CNT += ',';
    data += workObj.SPDL_OVRD1 += ',';
    data += workObj.SPDL_OVRD2 += ',';
    data += workObj.SPDL_OVRD3 += ',';
    data += workObj.SPDL_OVRD4 += ',';
    data += workObj.FEED_OVRD += ',';
    data += workObj.RAPID_OVRD += ',';
    data += workObj.WNO_NO += ',';
    data += workObj.unknown3 += ',';
    data += workObj.WNO_ATRB += ',';
    data += workObj.unknown += ',';
    data += workObj.ALARM_ATRB += ',';
    data += workObj.ALARM_NO += ',';
    data += workObj.ALARM_CODE1 += ',';
    data += workObj.ALARM_CODE2 += ',';
    data += workObj.ALARM_CODE3;
    data += '\r\n';



    fs.appendFileSync(file, data);

};