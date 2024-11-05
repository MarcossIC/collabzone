const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type : Boolean,
        default : false
    },
    permissions_emp: {
        type: Array,
        default: []
    }
},
    { timestamps: true }
)
const Emp = mongoose.model('Emp', empSchema);
module.exports = Emp;