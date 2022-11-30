const { prisma } = require('../db');
const Trend = require('../dbMongo')
const { groupBy } = require('../utils/utils')

class SecuritiesController {
    async getSecurities (req, res) {
        const { email } = req.user
        const account = await prisma.accounts.findFirst({ where: { email: email } })
        const subscExpAt = account.subscribtion_expires_at
        const date = new Date()
        const instruments = await prisma.instruments.findMany()
        let names = {}
        instruments.forEach(item => {
            let ticker = item.ticker
            let name = item.name
            names[ticker] = name
        })
    
        async function trends(plan) {
            switch (plan) {
                case "early_adopter":
                    return await Trend.find({ currency: "RUB" })
                case "foreign_access":
                    return await Trend.find({ currency: { $in: ['USD', 'EUR'] } })
                case "full_access":
                    return await Trend.find().all()
            }
        }

        async function newTrends() {
            let arr = await trends(account.plan)
            let group = Object.values(groupBy(arr, 'ticker'))
            let newArr = []
            group.map(item => {
                let obj = {
                    ticker: item[0].ticker,
                    name: names[item[0].ticker],
                    lastPrice: item[0].lastPrice,
                    _20days: item[0],
                    _60days: item[1]
                }
                newArr.push(obj)
            })
    
            return newArr
        }
    
        if (subscExpAt < date) {
            res.status(400).json({ message: "Ваша подписка истекла" })
        } else {
            res.json(await newTrends())
        }
    }
}

module.exports = new SecuritiesController()