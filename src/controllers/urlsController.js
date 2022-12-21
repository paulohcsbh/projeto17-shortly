import { connectionDB } from "../database/db.js";
import { nanoid } from "nanoid";

export async function urlsShorten(req, res){
    const { authorization } = req.headers;
    const {url} = req.body 
    const token = authorization?.replace("Bearer ", "").replace(/"/g, " ").trim();
    const shortUrl = nanoid(8)
    if (!token) {
        return res.sendStatus(401);
    }
    
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
};

export async function urlSearch(req, res) {
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
};

export async function openUrl(req, res){
    const { shortUrl } = req.params;
    if (typeof shortUrl !== "string") {
        return res.sendStatus(400);
    }
    try {
        const url = await connectionDB.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);
        const visitCount = url.rows[0].visitCount;
        if (!url.rows.length) {
            
            return res.sendStatus(404)

        } else {
            await connectionDB.query(`UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2`, [visitCount + 1, shortUrl])
            res.redirect(url.rows[0].url)
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

export async function deleteUrl(req, res){
    const { authorization } = req.headers;
    const id = parseInt(req.params.id);
    
    const token = authorization?.replace("Bearer ", "").replace(/"/g, " ").trim();
    
    if (isNaN(id)) {
        return res.sendStatus(400);
    }
    if (!token) {
        return res.sendStatus(401);
    }

    try{
        const user = await connectionDB.query(`SELECT * FROM sessions WHERE token = $1`, [token]);
        const url = await connectionDB.query(`SELECT * FROM urls WHERE id = $1`, [id]);
        if(!url.rows.length){
            return res.sendStatus(404);
        }
        if(user.rows[0].userId === url.rows[0].userId){
            await connectionDB.query(`DELETE FROM urls WHERE id = $1`, [id])
            return res.sendStatus(204);
        }else{
            return res.sendStatus(401);
        }
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};