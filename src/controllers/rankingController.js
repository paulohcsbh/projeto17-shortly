import { connectionDB } from "../database/db.js";

export async function ranking(req, res){
    const arr = [];
    try{
        const urlsUser = await connectionDB.query(`SELECT "id" AS id, name AS name FROM "signUp";`)
        const url = await connectionDB.query(`SELECT * FROM urls`);
        const urlsUser1 = await connectionDB.query(`SELECT urls."userId" AS id,"signUp".name AS name, SUM("visitCount") AS "visitCount" FROM urls JOIN "signUp" ON urls."userId" = "signUp".id GROUP BY "signUp".name, urls."userId";`)
        const countLinks = url.rows.map((link) => link.userId);
        
        for(let i = 0; i < urlsUser.rows.length; i++){
            const item = urlsUser.rows[i];
                       
            if(countLinks.includes(item.id)){
                let filterVisitCount = urlsUser1.rows.filter(id => id.id === item.id)
                let filterLink = countLinks.filter(link => link === item.id)
                
                const objRank = {
                    id: item.id,
                    name: item.name,
                    linksCount: filterLink.length,
                    visitCount: filterVisitCount[0].visitCount                    
                }
                arr.push(objRank)
            }else{
                const objRank = {
                    id: item.id,
                    name: item.name,
                    linksCount: 0,
                    visitCount: 0,
                                       
                }
                arr.push(objRank)
            }
        }
        res.status(200).send(arr.slice(0,10).sort((a, b) => {
            return a.visitCount > b.visitCount ? -1 : a.visitCount < b.visitCount ? 1 : 0; 
        }))        
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};