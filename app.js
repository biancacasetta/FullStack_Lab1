import express from 'express';
import 'dotenv/config';
import { router } from './router.js';
import { sendError } from './error.js';

// create server
const app = express();

// add middlewares
app.use((req, res, next) => {
    console.log(req.url);
    next();
});
app.use(express.static("./static"));
app.use(express.json());
app.use(router);
app.use(sendError);

app.listen(process.env.PORT, () => console.log("Server running in port 5000"));