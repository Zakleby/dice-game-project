const chalk = require("chalk")
const { infoLog, successLog } = require("../logger")
const prompt = require('prompt-sync')()
const { rollTwoDice, dice_art } = require('../lib/diceAnimation')
const loggedIn = require('../lib/loggedIn')
const sleep = require('../lib/sleep')
const start = require("./index")
const fs = require('fs')
const path = require('path')

async function game() {
    console.clear()
    infoLog(`STARTED! This game is ${loggedIn[0].username} VS ${loggedIn[1].username}\n`)

    for (let i = 0; i < 10; i++) {

        console.log(chalk.bgBlueBright('-- SCORE --') + '\n' + `${loggedIn[0].username} -> ${loggedIn[0].score} points` + '\n' + `${loggedIn[1].username} -> ${loggedIn[1].score} points\n`)
        if (loggedIn[i%2].username != "Computer") {
            prompt(chalk.magentaBright('[Waiting..]') + ` Waiting for ${loggedIn[i%2].username}... Press ENTER to roll the dice`)
            await roll(i%2)
        }
        else {
            console.log(chalk.magentaBright('[Waiting..]') + ` Waiting for Computer to roll dice`)
            await sleep(2000)
            await roll(i%2)
        }
    }

    console.log(chalk.redBright('- Game Over -'))
    console.log(chalk.blueBright('\n-- Final Score --') + '\n' + `${loggedIn[0].username} -> ${loggedIn[0].score} points` + '\n' + `${loggedIn[1].username} -> ${loggedIn[1].score} points\n`)
    if (loggedIn[0].score > loggedIn[1].score) {
        console.log(chalk.greenBright(`${loggedIn[0].username} Won by ${loggedIn[0].score - loggedIn[1].score} points!`))
        loggedIn[0].gamesWon += 1
        loggedIn[0].score = 0
    }
    else {
        console.log(chalk.greenBright(`${loggedIn[1].username} Won by ${loggedIn[1].score - loggedIn[0].score} points!`))
        loggedIn[1].gamesWon += 1
        loggedIn[1].score = 0
    }

    let authData = JSON.parse(fs.readFileSync(path.join(__dirname, '../authentication/users.json'), { encoding: 'utf8' }))
    authData = authData.filter(x => x.username != loggedIn[0].username && x.username != loggedIn[1].username)
    
    authData.push(...loggedIn)

    fs.writeFileSync(path.join(__dirname, '../authentication/users.json'), JSON.stringify(authData))

    // const replay = prompt(chalk.blueBright('Play Again? (y/n)'))
    // if (replay == 'y') {
    //     start()
    // }
    // else {
    //     console.log('Come back another time!')
    //     process.exit()
    // }
}

async function roll(user) {
    const dice = await rollTwoDice()
    if (dice.dice1 == dice.dice2) {
        console.log(chalk.blueBright('[DICE]') + ` ${loggedIn[user].username} rolled a double! (Double ${dice.dice1}) They get to roll another die. (Rolling in 3s)`)
        loggedIn[user].score += (dice.dice1 + dice.dice2)
        await sleep(3000)
        
        const cycles = 6
        let die = Math.floor(Math.random() * 6) + 1;
        for (let i = 0; i < cycles; i++) {
            console.clear()
            console.log(chalk.blueBright('[DICE]') + ` ${loggedIn[user].username} rolled a double! (Double ${dice.dice1}) They get to roll another die. (Rolling in 3s)`)
            console.log(chalk.blueBright('[INFO]') + ' Rolling Dice...');
            die = Math.floor(Math.random() * 6) + 1;
            const die_anim = dice_art[die]
            console.log(chalk.gray(die_anim));
            console.log(chalk.blueBright(`     ${die}`))
            
            await sleep(2000 / cycles);
        }

        loggedIn[user].score += die + dice.dice1 + dice.dice2
        
    }
    else if ((dice.dice1 + dice.dice2) % 2 == 0) {
        console.log(chalk.blueBright('[DICE]') + ` ${loggedIn[user].username} rolled an even number (${dice.dice1 + dice.dice2}). They were given an extra 10 points`)
        loggedIn[user].score += dice.dice1 + dice.dice2 + 10
    }
    else if ((dice.dice1 + dice.dice2) % 1 == 0) {
        console.log(chalk.blueBright('[DICE]') + ` ${loggedIn[user].username} rolled an odd number (${dice.dice1 + dice.dice2}). 5 points have been deducted from their score`)
        loggedIn[user].score += (dice.dice1 + dice.dice2) - 5
    }
}

module.exports = game