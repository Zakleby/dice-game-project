const chalk = require("chalk")
const { infoLog, successLog } = require("../logger")
const prompt = require('prompt-sync')()
const { rollTwoDice, dice_art } = require('../lib/diceAnimation')
const loggedIn = require('../lib/loggedIn')
const sleep = require('../lib/sleep')

let computerScore = 0

async function game() {
     
    console.clear()
    successLog('Game started!')
    infoLog(`This game is ${loggedIn.length == 1 ? `${loggedIn[0].username} VS Computer` : `${loggedIn[0].username} VS ${loggedIn[1].username}`}` + '\n\n')

    prompt(chalk.magentaBright('[Waiting..]') + ` Waiting for ${loggedIn[0].username}... Press ENTER to roll the dice`)
    await roll(0)

}


async function roll(user) {
    if (user != -1) {
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
    } else {
        
    }
}

module.exports = game