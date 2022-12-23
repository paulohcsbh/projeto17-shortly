import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { connectionDB } from "../database/db.js";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password != confirmPassword) {
        return res.send("Passwords devem ser iguais!").status(422);
    };

    const passwordHash = bcrypt.hashSync(password, 10);
    try {
        const emailExists = await connectionDB.query(`SELECT email FROM "signUp" WHERE email = $1`, [email]);
        
        if (emailExists.rows.length > 0) {
            return res.sendStatus(409);
        }
        await connectionDB.query(`INSERT INTO "signUp" (name, email, password, "confirmPassword") VALUES ($1, $2, $3, $4)`, [name, email, passwordHash, passwordHash]);
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

export async function signIn(req, res) {    
    const { email, password } = req.body;
    const token = uuidV4();

    try {
        const sessions = await connectionDB.query(`SELECT * FROM sessions`)
        const sessionExists = sessions.rows.filter(user => user.email === email)
        
        if(sessionExists.length){
            return res.sendStatus(409);
        }

        const user = await connectionDB.query(`SELECT * FROM "signUp" WHERE email = $1`, [email]);
        
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
};

export async function signOut(req, res){
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "").replace(/"/g, " ").trim();
    if (!token) {
        return res.sendStatus(401);
    }
    try {

        const user = await connectionDB.query(`SELECT "userId" FROM sessions WHERE token = $1`, [token]);
        if(!user.rows[0]){
            return res.sendStatus(409);
        }
        await connectionDB.query(`DELETE FROM sessions WHERE "userId" = $1`, [user.rows[0].userId]);
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}