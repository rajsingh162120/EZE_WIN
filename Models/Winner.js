const { Schema, model } = require('mongoose')

const WinnerSchema = new Schema({
    contest_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    prize: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
    },
    
}, {
    timestamps: true
})

const Winner = model('Winner', WinnerSchema)
module.exports = Winner