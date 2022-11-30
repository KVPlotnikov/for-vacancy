const {Schema} = require('mongoose')
const mongoose = require('mongoose')

mongoose.connect('доступ к базе', { useNewUrlParser: true })

const trendSchema = new Schema({
    ticker: { type: String, index: true },
    source: String,
    lastPrice: Number,
    currency: String,
    trendStart: {
      open: Number,
      close: Number,
      high: Number,
      low: Number,
      date: { type: Date, index: true },
      mins: [],
      maxs: []
    },
    previous: {
      open: Number,
      close: Number,
      high: Number,
      low: Number,
      date: Date,
      mins: [{
        date: Date,
        value: Number,
        period: Number,
        diff: Number
      }],
      maxs: [{
        date: Date,
        value: Number,
        period: Number,
        diff: Number
      }]
    },
    direction: String,
    period: Number,
    firstGoal: Number,
    secondGoal: Number
  })

trendSchema.index({ ticker: 1, period: 1 }, { unique: true })

const Trend = mongoose.model('Trend', trendSchema)

module.exports = Trend