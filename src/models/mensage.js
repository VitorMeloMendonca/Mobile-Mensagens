var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MensageSchema = new Schema({
    
    category: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: String, required: false },
    isActive: { type: Boolean, default: false },
    idUser: { type: String, required: true }
});

module.exports = mongoose.model('Mensage', MensageSchema);