const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')

const TransactionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        num:["Credit", "Debit"],
    },
    amount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default:'Pending',
        required: true
    },
    
}, {
    timestamps: true
})

const Transaction = model('Transaction', TransactionSchema)
module.exports = Transaction