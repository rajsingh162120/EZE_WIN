const mongoose = require('mongoose')
const { Schema, model } = require('mongoose');

const WinningSchema = new Schema({
    rank: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
})

const Winning = model('Winning', WinningSchema)
module.exports = Winning