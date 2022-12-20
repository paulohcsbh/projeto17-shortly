import express from "express";
import pkg from "pg";
import joi from "joi"
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
const connectionDB = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "shortly",
    password: "123456"
});

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required()
});
const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});
const urlSchema = joi.object({
    url: joi.string().required(),
});
const app = express();
app.use(express.json());

app.post("/signUp", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        return res.send("Passwords devem ser iguais!").status(422);
    };
    const passwordHash = bcrypt.hashSync(password, 10);

    const validation = signUpSchema.validate({
        name,
        email,
        password
    }, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors);
    }

    try {
        const emailExists = await connectionDB.query(`SELECT email FROM "signUp" WHERE email = $1`, [email]);
        console.log(emailExists.rows)
        if (emailExists.rows.length > 0) {
            return res.sendStatus(409);
        }
        await connectionDB.query(`INSERT INTO "signUp" (name, email, password, "confirmPassword") VALUES ($1, $2, $3, $4)`, [name, email, passwordHash, passwordHash]);
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post("/signIn", async (req, res) => {
    const { email, password } = req.body;

    const validation = signInSchema.validate({
        email,
        password
    }, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors);
    }

    const token = uuidV4();
    try {
        const user = await connectionDB.query(`SELECT * FROM "signUp" WHERE email = $1`, [email]);
        console.log(user.rows[0])
        if (user.rows[0].email && bcrypt.compareSync(password, user.rows[0].password)) {
            await connectionDB.query(`INSERT INTO sessions ("userId", email, token) VALUES ($1, $2, $3)`, [user.rows[0].id, user.rows[0].email, token]);
            return res.send({ token }).status(200);
        } else {
            return res.sendStatus(401);
        }

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

app.post("/urls/shorten", async (req, res) => {
    const { authorization } = req.headers;
    const { url } = req.body;
    const token = authorization?.replace("Bearer ", "").replace(/"/g, " ").trim();
    const shortUrl = nanoid(8)
    if (!token) {
        console.log("Entrei")
        return res.sendStatus(401);
    }

    const validation = urlSchema.validate({
        url
    }, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors);
    };

    try {
        const sessions = await connectionDB.query(`SELECT * FROM sessions WHERE token = $1`, [token]);
        const userId = sessions.rows[0].userId

        if (!sessions.rows[0]) {
            return res.sendStatus(401);
        } else {
            await connectionDB.query(`INSERT INTO urls ("shortUrl", url, "userId") VALUES ($1, $2, $3)`, [shortUrl, url, userId])

            return res.status(201).send(shortUrl);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get("/urls/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.sendStatus(400);
    }
    try {
        const url = await connectionDB.query(`SELECT id, "shortUrl", url FROM urls WHERE id = $1`, [id])
        console.log(url.rows)
        if (!url.rows.length) {
            return res.sendStatus(404);
        } else {
            return res.status(200).send(url.rows)
        }

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get("/urls/open/:shortUrl", async (req, res) => {
    const { shortUrl } = req.params;
    if (typeof shortUrl !== "string") {
        return res.sendStatus(400);
    }
    try {
        const url = await connectionDB.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);
        const visitCount = url.rows[0].visitCount;
        if (!url.rows.length) {
            console.log("entrei")
            return res.sendStatus(404)

        } else {
            await connectionDB.query(`UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2`, [visitCount + 1, shortUrl])
            res.status(302).redirect(url.rows[0].url)
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(4000, () => {
    console.log("Server running in port 4000.")
});