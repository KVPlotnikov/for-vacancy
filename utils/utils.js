const crypto = require('crypto')
const startOfDay = require('date-fns/startOfDay')
const addDays = require('date-fns/addDays')
const { addMonths } = require('date-fns')
const SHA1 = require('js-sha1')
const Base64 = require('js-base64').Base64

function generatePassword(
    length = 8,
    wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
) {
    return Array.from(crypto.randomFillSync(new Uint32Array(length)))
        .map((x) => wishlist[x % wishlist.length])
        .join('')
}

function generateDemoSubscribtionDate(days) {
    return startOfDay(addDays(new Date(), days))
}

function generateSubscriptionDate(month) {
    return startOfDay(addMonths(new Date(), month))
}

function getSignature(secretKey, requestData) {
    const values = Object.keys(requestData)
        .filter(key => key != 'signature')
        .filter(key => requestData[key] != '')
        .sort()
        .map(key => {
            return `${key}=${Base64.encode(requestData[key])}`
        })
        .join('&')

    const signature = SHA1(secretKey + SHA1(secretKey + values))
    return signature.toString()
}

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {})
}

module.exports = {
    generatePassword: generatePassword,
    generateDemoSubscribtionDate : generateDemoSubscribtionDate,
    generateSubscriptionDate: generateSubscriptionDate,
    getSignature: getSignature,
    groupBy: groupBy
}