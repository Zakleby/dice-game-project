const chalk = require('chalk')
const fs = require("fs")
const path = require("path")
const prompt = require('prompt-sync')()
const Authentication = require("../authentication/auth.js")
const { errorLog, warnLog, successLog, infoLog } = require("../logger.js")
const loggedIn = []
const game = require('./game.js')

console.clear()

infoLog('Welcome to the game!')

async function start() {

    const display = ["Sign Up"]

    if (loggedIn.length < 2) display.push("Login")
    if (loggedIn.length > 0) display.push("Start Game")
    display.push('Exit')


    console.log(`
${chalk.blueBright(`  .-------.    ______`)}
${chalk.blueBright(` /   o   /|   /\\     \\`)}
${chalk.blueBright(`/_______/o|  /o \\  o  \\  `)}   ${display[0] ? `1. ${display[0]}` : ''}
${chalk.blueBright(`| o     | | /   o\\_____\\`)}    ${display[1] ? `2. ${display[1]}` : ''}
${chalk.blueBright(`|   o   |o/ \\o   /o    /`)}    ${display[2] ? `3. ${display[2]}` : ''}
${chalk.blueBright(`|     o |/   \\ o/  o  /`)}     ${display[3] ? `4. ${display[3]}` : ''}
${chalk.blueBright(`'-------'     \\/____o/`)}

${chalk.blueBright(`Logged In:`)} ${chalk.grey(`${loggedIn.map(x => x.username).join(", ") ?? "No one"}`)}
    `)

    const response = display[Number(prompt('> '))-1].toLowerCase().replace(" ","_")
    console.log(response)

    if (response == "sign_up") {
        console.clear()
        const username = prompt('Enter a unique username: ')
        const password = prompt('Enter a rememberable password: ')
        new Authentication().signup(username, password).catch((error) => {
            if (error == "Username already exists") {
                console.clear()
                errorLog('This username already exists!')
                start()
            }
            if (error == 'both fields are required') {
                console.clear()
                errorLog('Both the username and password fields are required!')
                start()
            }
            return
        }).then(() => {
            console.clear()
            successLog(`Account created under the username ${username}.\nTo login with the account, type ${chalk.grey("2")} and then sign in with the username and password`)
            return start()
        })
    }
    else if (response == "login") {

        if (loggedIn.length > 1) {
            console.clear()
            errorLog('There are already two users logged in!')
            start()
            return
        }

        console.clear()
        const username = prompt('Enter your username: ')

        const currentLoggedInUsernames = loggedIn.map(x => x.username)
        if (currentLoggedInUsernames.includes(username)) {
            errorLog('This user is already logged in!')
            start()
            return
        }

        try {
            const user = await new Authentication().login(username)
            loggedIn.push(user)
            console.clear()
            successLog(`Welcome back, ${user.username}!`)
            start()
        } catch (err) {
            if (err == 'no user found') {
                errorLog('No user found with that username!')
                start()
                return
            }
            else if (err == 'invalid password') {
                errorLog('Invalid password!')
                start()
                return
            }
        }
    }
    else if (response == 'start_game') {
        game(loggedIn)
    }

    else if (response == 'exit') {
        process.exit()
    }

    else {
        console.clear()
        errorLog('Not a valid option!')
        start()
        return
    }
}

start()