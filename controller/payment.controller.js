const { prisma } = require('../db');
const axios = require('axios');
const { getSignature } = require('../utils/utils')
const { generateSubscribtionDate } = require('../utils/utils')

class PaymentController {

    async initiatePayment (req, res) {
        const { id } = req.user
        const { plan } = req.body
        const planInfo = await prisma.plans.findFirst({ where: { id: plan } })
        const account = await prisma.accounts.findFirst({ where: { id: id } })
        let date = Math.round(Date.now() / 1000).toString()
    
        let requestData = {
            merchant: "",
            amount: planInfo.price,
            custom_order_id: planInfo.id,
            receipt_items: [{
                name: planInfo.name,
                price: planInfo.price,
                quantity: 1,
                sno: "usn_income",
                payment_object: "service",
                payment_method: "full_prepayment",
                vat: "none"
            }],
            unix_timestamp: date
        }
    
        requestData.receipt_items = JSON.stringify(requestData.receipt_items)
        requestData['signature'] = getSignature(secretKey, requestData)
    
        axios({
            method: "POST",
            url: "https://pay.modulbank.ru/api/v1/bill/",
            data: requestData
        })
            .then((response) => {
                res.json(response.data.bill.url)
            })
            .catch((err) => {
                console.error(err)
                res.status(500).json(err)
            })
    }

    async confirmTransaction (req, res) {
        const { client_email, custom_order_id, transaction_id, state, original_amount } = req.body
        const account = await prisma.accounts.findFirst({where: {email: client_email}})
        const date = new Date()
    
        const newTransaction = await prisma.transactions.create({
            data: {
                account_id: account.id,
                plan_id: custom_order_id,
                external_id: transaction_id,
                email: client_email,
                status: state,
                amount: original_amount,
                inserted_at: date,
                updated_at: date
            }
        })
    
        const updateAccount  = await prisma.accounts.update({
            where: {
                email: client_email
            },
            data: {
                subscribtion_expires_at: generateSubscribtionDate(1),
                plan: custom_order_id
            }
        })
    }
}

module.exports = new PaymentController()
