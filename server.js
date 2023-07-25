const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors')
const parser = require('body-parser')
const brcypt = require('bcrypt');
require('dotenv').config()

const mysqlPwd = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const db = process.env.MYSQL_DB;

const conn = mysql.createConnection({
    host: host,
    user: user,
    password: mysqlPwd,
    database: db
})

app.use(cors({
    origin: "*"
}))

app.use(parser.json({ type: '*/*' }))
app.post("/login", (req, res) => {
    
    let [action, user, password] = req.body;
    

    conn.connect((error) => {
        if (error) {
            console.log(error);
            res.send("unable to connect to database")
        }

        else {
            
            const sql = "select * from login where user_name=?";
            conn.query(sql, [user], (error, rows) => {
                if (error) {
                    console.log(error)
                }
                else if (rows.length == 0) {
                    res.send("invalid credentials")
                    
                }
                else {
                    if (action == "login") {
                        let hash = rows[0].user_password;
                        checkPassword(password, hash, (result) => {

                            res.send(result)
                            
                        })
                    }

                    else {
                        hashPassword(password, (response) => {
                            
                            let sql = "update login set user_password = ? where user_name = ?"
                            conn.query(sql, [response, user], (error, rows) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    res.send("password updated")
                                    
                                }
                            })

                        })
                    }
                }
            })
        }
    });
})

app.post("/register", (req, res) => {
    const user = req.body[0]
    const status = "Live"
    let password = req.body[1];
    const sql = "select * from login where user_name = ?"
    conn.query(sql,[user],(error,rows)=>{
        if(error){
            console.log(error)
        }
        else if(rows.length>0){
            res.send("user exists")
        }
        else {
            hashPassword(password, (hashed) => {
                const sql = "insert into login (user_name,user_password,user_status) values (?,?,?)"
                let password = hashed;
                conn.query(sql, [user, password, status], (error) => {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        res.send("user created")
                    }
                })
            })
        }
    })
})

async function checkPassword(pwd, hash, callback) {
    const result = await brcypt.compare(pwd, hash);
    if (result === true) {
        callback("valid credentials")
    }
    else {
        callback("invalid credentials")
    }
}

async function hashPassword(password, callback) {
    const hash = await brcypt.hash(password, 10)
    callback(hash)
}
app.listen(3000, () => { });
