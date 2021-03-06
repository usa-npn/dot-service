"use strict";
var archiver = require('archiver');
var config = require('config');
var fs = require('graceful-fs');
function createZip(downloadType, filesToZip, requestTimestamp) {
    return new Promise(function (resolve, reject) {
        var zipFileName = 'datasheet_' + requestTimestamp.toString() + '.zip';
        var zipFilePath = config.get('save_path') + zipFileName;
        var zipStream = fs.createWriteStream(zipFilePath);
        var archive = archiver.create('zip', {});
        zipStream.on('close', function () {
            console.log('All files are zipped!');
            resolve(zipFileName);
        });
        archive.on('error', function (err) {
            reject(err);
        });
        archive.pipe(zipStream);
        for (var _i = 0, filesToZip_1 = filesToZip; _i < filesToZip_1.length; _i++) {
            var fileName = filesToZip_1[_i];
            var fileNameWithoutTimestamp = fileName.replace(/[0-9]/g, "");
            archive.append(fs.createReadStream(config.get('save_path') + fileName), { name: fileNameWithoutTimestamp });
        }
        if (downloadType === 'Status and Intensity' && fs.existsSync(config.get('metadata_path') + 'status_intensity_datafield_descriptions.xlsx')) {
            archive.append(fs.createReadStream(config.get('metadata_path') + 'status_intensity_datafield_descriptions.xlsx'), { name: 'status_intensity_datafield_descriptions.xlsx' });
        }
        else if (downloadType === 'Site Phenometrics' && fs.existsSync(config.get('metadata_path') + 'site_phenometrics_datafield_descriptions.xlsx')) {
            archive.append(fs.createReadStream(config.get('metadata_path') + 'site_phenometrics_datafield_descriptions.xlsx'), { name: 'site_phenometrics_datafield_descriptions.xlsx' });
        }
        else if (downloadType === 'Individual Phenometrics' && fs.existsSync(config.get('metadata_path') + 'individual_phenometrics_datafield_descriptions.xlsx')) {
            archive.append(fs.createReadStream(config.get('metadata_path') + 'individual_phenometrics_datafield_descriptions.xlsx'), { name: 'individual_phenometrics_datafield_descriptions.xlsx' });
        }
        if (filesToZip.length > 2 && fs.existsSync(config.get('metadata_path') + 'ancillary_datafield_descriptions.xlsx')) {
            archive.append(fs.createReadStream(config.get('metadata_path') + 'ancillary_datafield_descriptions.xlsx'), { name: 'ancillary_datafield_descriptions.xlsx' });
        }
        archive.finalize();
    });
}
exports.createZip = createZip;
