const Fs = require('fs');

module.exports =
{
    API_URL: `http://${process.env.DEV_IP}:8080`,
    BC_URL: `http://${process.env.DEV_IP}:8545`,
    T721HUB_ADDRESS: JSON.parse(Fs.readFileSync(process.env.DIST_PATH + '/contracts/Ticket721Hub.json').toString()).deployedAddress,
    T721HUB_ABI: JSON.parse(Fs.readFileSync(process.env.DIST_PATH + '/contracts/Ticket721Hub.json').toString()).abiDefinition,
    T721PU_ADDRESS: JSON.parse(Fs.readFileSync(process.env.DIST_PATH + '/contracts/Ticket721Public.json').toString()).deployedAddress,
    T721PU_ABI: JSON.parse(Fs.readFileSync(process.env.DIST_PATH + '/contracts/Ticket721Public.json').toString()).abiDefinition,
    T721VE_ADDRESS: JSON.parse(Fs.readFileSync(process.env.DIST_PATH + '/contracts/Ticket721.json').toString()).deployedAddress,
    T721VE_ABI: JSON.parse(Fs.readFileSync(process.env.DIST_PATH + '/contracts/Ticket721.json').toString()).abiDefinition,
    BC_CHAIN_ID: 2702,
    BC_CHAIN_NAME: 'custom'
};
