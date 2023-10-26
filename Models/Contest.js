const { Schema, model } = require('mongoose')

const ContestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    entry_fee: {
        type: String,
        required: true
    },
    max_members: {
        type: String,
        required: true
    },
    starts_at: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
})

const Contest = model('Contest', ContestSchema)
module.exports = Contest