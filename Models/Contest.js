const mongoose = require('mongoose')
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
        type: Date,
        required: true
    },
    status: {
        type: String,
        default:'Upcoming',
        required: true
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
     winnings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Winning",
      },
    ],
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    }

    
}, {
    timestamps: true
})

const Contest = model('Contest', ContestSchema)
module.exports = Contest