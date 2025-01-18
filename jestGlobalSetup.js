const { exec } = require('child_process');
const waitOn = require('wait-on');

module.exports = async () => {
    exec('npm run dev');
    await waitOn({ resources: ['http://localhost:3000']});
};