import express from "express";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config({path: "../.env"});

import signRoutes from "./routes/signRoutes.js";
import urlsRoutes from "./routes/urlsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(signRoutes);
app.use(urlsRoutes);
app.use(userRoutes);
app.use(rankingRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running in port ${port}.`)
});