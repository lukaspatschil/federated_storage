const rimraf = require('rimraf');
const path = require('path');
const util = require('util');
const { promises: { readdir } } = require('fs');
const fs = require('fs');

(async function generateTypes() {
    const services = await (await readdir('./backend')).filter(el => el.endsWith('service'));
    const servicePaths = services.map(service => path.join(__dirname, '..', 'backend', service));
    
    const typeFiles = './backend/service-types';

    servicePaths.forEach(async servicePath => {
        copyFolderRecursiveSync(typeFiles, servicePath);
    });
})();

function copyFileSync( source, target ) {

    let targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    let files = [];

    // Check if folder needs to be created or integrated
    const targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            const curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}
