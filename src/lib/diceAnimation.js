const chalk = require('chalk')
const sleep = require('./sleep')


//////////////////////////////////////////////////
//       This game was created by Zakleby       //
// https://github.com/Zakleby/dice-game-project //
//////////////////////////////////////////////////


const dice_art = {
    1: `┌─────────┐
│         │
│    ●    │
│         │
└─────────┘`,
    2: `┌─────────┐
│  ●      │
│         │
│      ●  │
└─────────┘`,
    3: `┌─────────┐
│  ●      │
│    ●    │
│      ●  │
└─────────┘`,
    4: `┌─────────┐
│  ●   ●  │
│         │
│  ●   ●  │
└─────────┘`,
    5: `┌─────────┐
│  ●   ●  │
│    ●    │
│  ●   ●  │
└─────────┘`,
    6: `┌─────────┐
│  ●   ●  │
│  ●   ●  │
│  ●   ●  │
└─────────┘`
}

async function rollTwoDice() {
    const cycles = 6
    let random1 = Math.floor(Math.random() * 6) + 1;
    let random2 = Math.floor(Math.random() * 6) + 1;

    for (let i = 0; i < cycles; i++) {
        console.clear()
        console.log(chalk.blueBright('[INFO]') + ' Rolling Dice...');
        random1 = Math.floor(Math.random() * 6) + 1;
        random2 = Math.floor(Math.random() * 6) + 1;
        const dice1 = dice_art[random1].split('\n');
        const dice2 = dice_art[random2].split('\n');
        
        for (let j = 0; j < dice1.length; j++) {
            console.log(chalk.gray(dice1[j] + '  ' + dice2[j]));
        }

        console.log(chalk.blueBright(`     ${random1}            ${random2}`))
        
        await sleep(2000 / cycles);

        if (i == cycles-1) {
            return {
                dice1: random1,
                dice2: random2
            }
        }
    }
}

//////////////////////////////////////////////////
//       This game was created by Zakleby       //
// https://github.com/Zakleby/dice-game-project //
//////////////////////////////////////////////////


module.exports = { dice_art, rollTwoDice }