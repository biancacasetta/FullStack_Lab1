import mongoose from 'mongoose';
import 'dotenv/config';

// create connection to the database
mongoose.connect(process.env.CONNECTION_URL);

// create dishes' collection structure
const dishesSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    preparation: {
        type: [String],
        required: true
    },
    cooking_time: {
        type: Number,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
});

// create collection in database
const dishes = mongoose.model("dishes", dishesSchema);

export { dishesSchema, dishes }; 