const fs = require("fs")
const path = require("path")
const prompt = require('prompt-sync')()
const Authentication = require("./authentication/auth.js")

const loggedIn = []

async function start() {
    console.log(`
-=- -=- -=- -=- -=- -=- -=- -=- -=- -=-
Please sign in or create an account

1. Sign Up
2. Log in

-=- -=- -=- -=- -=- -=- -=- -=- -=- -=-
    `)

    const response = prompt('Enter: ')
    if (response == "1") {
        console.clear()
        const username = prompt('Enter a unique username: ')
        const password = prompt('Enter a rememberable password: ')
        new Authentication().signup(username, password).catch((error) => {
            if (error.message == "Username already exists") {
                console.clear()
                console.log('\nThis username already exists!')
                return start()
            }
        })
    }
}

start()