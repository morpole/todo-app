const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        default: 'Low'
        
    }
 
}, { strict: false });

module.exports = mongoose.model('Task', taskSchema);
