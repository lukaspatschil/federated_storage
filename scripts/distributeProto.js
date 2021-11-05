const rimraf = require('rimraf');
const path = require('path');
const util = require('util');
const { promises: { readdir, mkdir, copyFile } } = require('fs');
const rimrafAwait = util.promisify(rimraf);

(async function distributeProto() {
    const services = await (await readdir('./backend')).filter(el => el.endsWith('service'));
    const servicePaths = services.map(service => path.join(__dirname, '..', 'backend', service, 'proto'));
    
    const protoFiles = await readdir('./backend/proto');
    const protoFilePaths = protoFiles.map(protoFile => path.join(__dirname, '..', 'backend/proto', protoFile));

    servicePaths.forEach(async servicePath => {
        const destinationPaths = protoFiles.map(protoFile => path.join(servicePath, protoFile));
        await rimrafAwait(servicePath);
        await mkdir(servicePath);
        for (let index = 0; index < protoFilePaths.length; index++) {
            await copyFile(protoFilePaths[index], destinationPaths[index])
        }
    });
})();