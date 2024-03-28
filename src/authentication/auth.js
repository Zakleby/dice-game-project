const fs = require("fs")
const path = require("path")
const prompt = require('prompt-sync')()

//////////////////////////////////////////////////
//       This game was created by Zakleby       //
// https://github.com/Zakleby/dice-game-project //
//////////////////////////////////////////////////

const caesarCipher = (str, shift) => {
    const numberToShift = shift > 0 ? shift : 26 + (shift % 26);
    return [...str].map((l, i) => {
        const character = str.charCodeAt(i);
        if (character >= 65 && character <= 90)
            return String.fromCharCode(((character - 65 + numberToShift) % 26) + 65);
        if (character >= 97 && character <= 122)
            return String.fromCharCode(((character - 97 + numberToShift) % 26) + 97);
        return l;
    }).join('');
};



class Authentication {
    constructor() {
        return this
    }

    encrypt(password) {
        return caesarCipher(password, 16)
    }

    async signup(username, password) {
        if (!username || !password) {
            throw 'both fields are required';
        }
    
        let fileData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), { encoding: 'utf8' }))

        if (fileData.length == 0) {
            fileData.push({
                username: "Computer",
                password: "Computer1",
                dateJoined: Date.now(),
                gamesWon: 0,
                score: 0
            });
        }

        const usernames = fileData.map(x => x.username.toLowerCase())
    
        if (usernames.includes(username.toLowerCase())) {
            throw 'Username already exists';
        }
    
        try {
            fileData.push({
                username,
                password: this.encrypt(password),
                dateJoined: Date.now(),
                gamesWon: 0,
                score: 0
            });
    
            fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(fileData, null, 3));
    
        } catch (error) {
            throw error
        }
    }

    async login(username) {
        let fileData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), { encoding: 'utf8' }))
        const user = fileData.find(x => x.username == username)
    
        if (!user) {
            throw 'no user found';
        }
    
        return new Promise((resolve, reject) => {
            const input = prompt(`Please enter password for ${username}: `);
    
            if (user.password === this.encrypt(input)) {
                resolve(user);
            } else {
                reject('invalid password');
            }
        });
    }
}

//////////////////////////////////////////////////
//       This game was created by Zakleby       //
// https://github.com/Zakleby/dice-game-project //
//////////////////////////////////////////////////

module.exports = Authentication