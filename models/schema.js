const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    username: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    address:[
        {
            name:{ type: String, required: true },
            street:{ type: String, required: true },
            pincode:{ type: Number, required: true },
            phone_number: { type: Number, required: true },
            location:{
                latitude: { type: Number },longitude: { type: Number },
            },
            billing_address:{ type: Boolean},
            shipping_address:{ type: Boolean}
        }
    ]
});

module.exports.usersSchema = mongoose.model('Users', usersSchema);