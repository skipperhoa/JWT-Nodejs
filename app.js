require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors())
/* config cors allow URL Client */
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
/* DATA SIMBLE */
const sqlite3 = require('sqlite3').verbose();
// Setup the database connection
let conn = new sqlite3.Database("./database.db", err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to the in-memory SQLite database.");
});

app.post("/welcome", (req, res) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
  
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        var decoded = jwt.verify(token, process.env.TOKEN_KEY);
        res.status(200).send(decoded.user);
    } catch (err) {
        res.status(401).json({"success":0,"error":"Invalid Token"});
    }
   
});
// Register
app.post("/register",cors(corsOptions), async (req, res) => {
// Our register logic starts here
        try {
            // Get user input
            const { first_name, last_name, email, password } = req.body;

            // Validate user input
            if (!(email && password && first_name && last_name)) {
                res.status(400).json({"success":1,"description":"All input is required","body":req.body});
            }else{
                var sql = "INSERT INTO users(first_name,last_name,email,password) values('" + first_name + "','" + last_name + "','" + email + "','" + password + "')";
                conn.serialize(()=>{
                    conn.run(
                    sql, function (err) {
                        if (err) {
                            res.status(500).json({"success":0,"description":"Đăng Ký Không Thành Công!"});
                        }else{
                                let lastID = this.lastID;
                                res.status(200).json({"success":1,"description":"Đăng Ký Thành Công!"});
                        }
                    }
                );
                    
                });
            }

            /* save user to databse */
        } catch (err) {
            console.log(err);
        }
});


// Login
app.post("/login", cors(corsOptions),async (req, res) => {

   
        const { email, password } = req.body;


        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        conn.serialize(()=>{
            conn.get("select * from users where email=? and password=?", [email, password],async  function (err, row) {
                if(err){
                    res.status(500).send({'Response':'Error updating user', err });   
                }
                if(row){
                    
                    let _id = row.id;
                    const {first_name,last_name,email} = row;
                    var user ={first_name,last_name,email};
                    var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), user: user }, process.env.TOKEN_KEY);
                    conn.run("update users set token=? where id=?", [token, _id], function (err2) {
                        if (err2) {
                            res.status(400).json({ "description": "Đăng nhập không thành công" });
                        }else{
                            res.status(200).json({"success":1,"token":token});
                        }
                    });
                }else{
                    res.status(500).json({"success":0});
                }
               
            });
        })
       
});

module.exports = app;