import mongoose from 'mongoose';
import 'dotenv/config';

// create connection to the database
mongoose.connect(process.env.CONNECTION_URL);

// create dishes' collection structure
const dishesSchema = new mongoose.Schema({
    name: String,
    ingredients: [String],
    preparation: [String],
    cooking_time: Number,
    origin: String
});

// create collection in database
export const dishes = mongoose.model("dishes", dishesSchema);