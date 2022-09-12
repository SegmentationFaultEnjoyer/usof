const webp = require('webp-converter');
const {join} = require('path');
const fs = require('fs');
const filesystem = require ('fs-extra');

webp.grant_permission();

function convertToWebp(path, name, dest = null) {
    return new Promise((resolve, reject) => {
        const newName = transformName(name);

        const result = webp.cwebp(join(path, name), join(path, newName),"-q 80",logging="-v");
        result
            .then((response) => {
                // console.log('CONVERTED TO WEBP');
                fs.unlinkSync(join(path, name));

                if(dest != null) {
                    move(path, dest, newName);
                }
                resolve(newName);
            })
            .catch(e => {
                // console.error('convert error', e.message);
                reject(e);
            }) 
    })  
    
}

function transformName(name) {
    let [base, ext] = name.split('.');
    return `${base}_${Date.now()}.webp`
}

function move(src, dest, name) {
    filesystem.move(
        join(src, name),
        join(dest, name),
        err => {
            if(err) {throw err};
            // console.log (`Moved ${name} to folder '${dest}'`);
        }
    )
}

module.exports = convertToWebp;