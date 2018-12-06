exports.read = () => require('fs').readFileSync(0, 'utf-8').trim().split('\n')
