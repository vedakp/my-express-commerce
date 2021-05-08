const mongoose = require('mongoose');

//Users Schema
const usersSchema = mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    address: [
        {
            name: { type: String, required: true },
            street: { type: String, required: true },
            pincode: { type: Number, required: true },
            phone_number: { type: Number, required: true },
            location: {
                latitude: { type: Number }, longitude: { type: Number },
            },
            billing_address: { type: Boolean },
            shipping_address: { type: Boolean }
        }
    ],
    auth:{
        role: [{ type: String }],
        token: { type: String },
        ttl: { type: Number }
    }

});
mongoose.model('Users', usersSchema).createCollection();
module.exports = mongoose.model('Users', usersSchema);