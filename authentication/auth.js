const fs = require("fs")
const path = require("path")
const prompt = require('prompt-sync')()

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
        let fileData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), {encoding: 'utf8'} ))
        const usernames = fileData.map(x => x.username.toLowerCase())

        if (usernames.includes(username.toLowerCase())) {
            throw Error('Username already exists')
        }

        fileData.push({
            username,
            password: this.encrypt(password),
            dateJoined: Date.now(),
            gamesWon: 0,

        })

        fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(fileData, null, 3))

        console.log('added user ' + username)
    }

    async login(username) {
        let success = false
        let fileData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), {encoding: 'utf8'} ))
        const user = fileData.find(x => x.username == username)

        if (!user) {
            throw Error('no user with name' + username)
        }

        return new Promise((resolve, reject) => {            
                readline.question(`Please enter password for ${username}: `, async (input) => {
                    if (user.password == this.encrypt(input)) {
                    success = true
                }
                else {
                    reject()
                    throw Error(`Invalid password for user ${username}`)
                }

                readline.close()

                return resolve(success ? user : 'Invalid')
            })
        })
    }
}

module.exports = Authentication