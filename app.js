import express from 'express';
import 'dotenv/config';
import router from './router.js';

// create server
const app = express();

// add middlewares
app.use(express.static("./static"));
app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => console.log("Server running in port 5000"));