const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
    id_emp: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Emp',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tileset: {
        type: String,
        required: true
    },
    permissions: {
        type: Array,
        default: []
    },
    users: [
        {
            userId: String,
            socketId: String,
            username: String,
            x : Number,
            y : Number
        },
    ],
},
    { timestamps: true }
)
const Rooms = mongoose.model('Rooms', roomsSchema);
module.exports = Rooms;