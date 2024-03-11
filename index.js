const chalk = require('chalk')
const fs = require("fs")
const path = require("path")
const prompt = require('prompt-sync')()
const Authentication = require("./authentication/auth.js")
const { errorLog, warnLog, successLog, infoLog } = require("./logger.js")
const loggedIn = []

console.clear()

infoLog('Welcome to the game!')

async function start() {
    console.log(`
${chalk.blueBright(`  .-------.    ______`)}      
${chalk.blueBright(` /   o   /|   /\\     \\`)}       
${chalk.blueBright(`/_______/o|  /o \\  o  \\  `)}   1. Sign Up
${chalk.blueBright(`| o     | | /   o\\_____\\`)}    2. Login
${chalk.blueBright(`|   o   |o/ \\o   /o    /`)}    3. Start Game
${chalk.blueBright(`|     o |/   \\ o/  o  /`)}     4. Exit
${chalk.blueBright(`'-------'     \\/____o/`)}

${chalk.blueBright(`Logged In:`)} ${chalk.grey(`${loggedIn.map(x => x.username).join(", ") ?? "No one"}`)}
`)

    const response = prompt('> ')
    if (response == "1") {

        
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
    else if (response == "2") {

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
            }
            else if (err == 'invalid password') {
                errorLog('Invalid password!')
            }
        }
    }
    else if (response == '3') {

    }

    else {
        console.clear()
        errorLog('Not a valid option!')
        start()
        return
    }
}

start()