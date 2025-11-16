import {pool} from "../model/db.js";

export const requestLogger = (req,res,next) =>{
    res.on("finish", async () => {
        try{
            await pool.query(
                `
                INSERT INTO logs(method,path,status_code,body,query)
                VALUES($1,$2,$3,$4,$5)
                `,
                [
                    req.method,
                    req.originalUrl,
                    res.statusCode,
                    req.body || {},
                    req.query || {}
                ]


            );
        }catch(error){
            console.error("Failed to log event",error.message)

        }
    })
    next();
}