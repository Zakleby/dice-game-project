const chalk = require('chalk')

const errorLog = (message) => console.log(chalk.redBright('[ERROR]') + ' ' + message)
const warnLog = (message) => console.log(chalk.yellowBright('[WARN]') + ' ' + message)
const successLog = (message) => console.log(chalk.greenBright('[SUCCESS]') + ' ' + message)
const infoLog = (message) => console.log(chalk.blueBright('[INFO]') + ' ' + message)

module.exports = {errorLog, warnLog, successLog, infoLog}