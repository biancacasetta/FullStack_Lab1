import mongoose from 'mongoose';
import 'dotenv/config';

// create connection to the database
mongoose.connect(process.env.CONNECTION_URL);

// create dishes' collection structure
const dishesSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    ingredients: [String],
    preparation: [String],
    cooking_time: Number,
    origin: String
});

// create collection in database
const dishes = mongoose.model("dishes", dishesSchema);

export { dishesSchema, dishes }; 