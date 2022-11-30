const { prisma } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { generatePassword, generateDemoSubscribtionDate } = require('../utils/utils')

class AccountController {
    async login (req, res) {

        const { email, password } = req.body

        if (!email || !password || email === '' || password === '') {
            res.status(400).json({ error: 'No email or password provided' })
            return
        }
        const account = await prisma.accounts.findFirst({ where: { email: email } })
    
        if (!account) {
            res.status(401).json({ error: 'Wrong email' })
            return
        }
    
        if (!bcrypt.compareSync(password, account.password)) {
            res.status(401).json({ error: 'Wrong password' })
            return
        }
    
        const accountData = { id: account.id, email: account.email }
        const token = jwt.sign(accountData, 'secret')
        const accountResponse = { ...account, password: undefined }
        res.json({
            account: accountResponse,
            authToken: token
        })
    }

    async signup (req, res) {
        const { email } = req.body

    if (!email || email === '') {
        res.status(400).json({ error: `No email provided (${email})` })
        return
    }

    const account = await prisma.accounts.findFirst({ where: { email: email } })

    if (account) {
        res.status(401).json({ error: 'User with this email is already registered' })
        return
    }

    let password = generatePassword()
    let expireDate = generateDemoSubscribtionDate(14)
    let hashedPassword = await bcrypt.hash(password, 1024)

    const newAccount = await prisma.accounts.create({
        data: {
            email: email.toLowerCase(),
            password: hashedPassword,
            subscribtion_expires_at: expireDate,
            plan: "early_adopter"
        }
    })

    res.json({ message: "Succes", password })

    axios({
        method: "POST",
        url: "https://api.sendgrid.com/v3/mail/send",
        headers: { "Authorization": `Bearer ${mailToken}` },
        data: {
            personalizations: [{
                to: [{ email: email }],
                dynamic_template_data: {
                    email: email,
                    password: password,
                    "expires-at": expireDate.toLocaleDateString('ru-RU')
                }
            }
            ],
            from: sender,
            template_id: ""
        }
    })
    .then((response) => {
        console.log(response.status)
    })
    .catch((error) => {
        console.error(error)
    })
    }

    async restorePassword (req, res) {
        const { email } = req.body
        const account = await prisma.accounts.findFirst({ where: { email: email } })

        if (!account) {
            res.status(400).json({message: 'User is not find'})
        } else {
            let password = generatePassword()
            let hashedPassword = await bcrypt.hash(password, 1024)
    
            const updatePassword = await prisma.accounts.update({
                where: {email: email},
                data: {password: hashedPassword}
            })

            axios({
                method: "POST",
                url: "https://api.sendgrid.com/v3/mail/send",
                headers: { "Authorization": `Bearer ${mailToken}` },
                data: {
                    personalizations: [{
                        to: [{ email: email }],
                        dynamic_template_data: {
                            email: email,
                            password: password
                        }
                    }
                    ],
                    from: sender,
                    template_id: ""
                }
            })
            .then((response) => {
                console.log(response.status)
            })
            .catch((error) => {
                console.error(error)
            })

            res.json({message: 'Success'})
        }
        
    }
}

module.exports = new AccountController()