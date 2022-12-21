import { connectionDB } from "../database/db.js";

export async function userUrls(req, res){
    const arr = [];
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").replace(/"/g, " ").trim();
    if (!token) {
        return res.sendStatus(401);
    }
    try{
        const user = await connectionDB.query(`SELECT * FROM sessions WHERE token = $1`, [token]);
        
        if(!user.rows.length){
            return res.sendStatus(401);
        }
        const url = await connectionDB.query(`SELECT * FROM urls WHERE "userId" = $1`, [user.rows[0].userId]);
        if(url.rows.length){
            const urlsUser = await connectionDB.query(`SELECT urls."userId" AS id,"signUp".name AS name, SUM("visitCount") AS "visitCount" FROM urls JOIN "signUp" ON urls."userId" = "signUp".id GROUP BY "signUp".name, urls."userId";`)
            const filter = urlsUser.rows.filter(url => url.id === user.rows[0].userId);
            url.rows.forEach((item) => {
                delete item.userId
                delete item.createdAt
                arr.push(item)
            });
            const objUser = {
                id: filter[0].id,
                name: filter[0].name,
                visitCount: filter[0].visitCount,
                shortenedUrls: arr
            }
            return res.status(200).send(objUser)
        }else{
            const urlsUser = await connectionDB.query(`SELECT "userId" AS id, "signUp".name AS name FROM sessions JOIN "signUp" ON sessions."userId" = "signUp".id;`)
            const filterUser = urlsUser.rows.filter(url => url.id === user.rows[0].userId);
            
            const objUser = {
                id: filterUser[0].id,
                name: filterUser[0].name,
                visitCount: 0,
                shortenedUrls: arr
            }
            return res.status(200).send(objUser);
        }
        
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};