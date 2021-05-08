//Product Schema
const productSchema = mongoose.Schema({
    sku: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    manufacture_details: {
        model_number: { type: String, required: true },
        release_date: { type: Date, required: true }
    },
    shipping_details: {
        weight: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        depth: { type: Number, required: true },
        location: {
            latitude: { type: Number }, longitude: { type: Number },
        },
    },
    quantity: { type: Number, required: true },
    pricing: {
        price: { type: Number, required: true },
        sale_price: { type: Number, required: true },
        cgst: { type: Number, required: true },
        sgst: { type: Number, required: true },
    }
});
mongoose.model('Products', productSchema).createCollection();
module.exports = mongoose.model('Products', productSchema);