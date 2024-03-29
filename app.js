require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const app = express();
app.use(express.json());

/* DATA SIMBLE */
const sqlite3 = require('sqlite3').verbose();
// Setup the database connection
let conn = new sqlite3.Database("./database.db", err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to the in-memory SQLite database.");
});

// Register
router.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }else{
            var sql = "INSERT INTO users(first_name,last_name,email,password) values('" + first_name + "','" + last_name + "','" + email + "','" + password + "')";
            conn.serialize(()=>{
                conn.run(
                   sql, function (err) {
                       if (err) {
                           res.status(500).json(err.message);
                       }else{
                            let lastID = this.lastID;
                            res.status(200).json({"success":1,"lastID":lastID});
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
router.post("/login", async (req, res) => {

   
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
                    var refresh_token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24*60*60), user: user }, process.env.TOKEN_KEY);
                    conn.run("update users set token=?,refresh_token=? where id=?", [token,refresh_token, _id], function (err2) {
                        if (err2) {
                            res.status(400).json({ "description": "Đăng nhập không thành công" });
                        }else{
                            res.status(200).json({"success":1,"token":token,"refresh_token":refresh_token});
                        }
                    });
                }else{
                    res.status(500).json({"success":0});
                }
               
            });
        })
       
});


/**
 * Lấy mã token mới sử dụng Refresh token
 * POST /refresh_token
 */
 router.post('/refresh_token', async (req, res) => {
  const { refreshToken } = req.body;
    conn.get("select token,refresh_token from users where refresh_token=?",[refreshToken],function(error,row){
      if(error) res.status(400).json({"description":"refresh token không chính xác!"});
      else{
        try {
             var decoded = jwt.verify(row['refresh_token'], process.env.TOKEN_KEY);
             var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60*60), user: decoded.user }, process.env.TOKEN_KEY);
             res.status(200).json({"success":1,"token":token,"refresh_token":row['refresh_token']});
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
      }
   });
 
});

/**
 * Middleware xác thực người dùng dựa vào mã token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 const TokenCheckMiddleware = async (req, res, next) => {
  // Lấy thông tin mã token được đính kèm trong request
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // Xác thực mã token và kiểm tra thời gian hết hạn của mã
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_KEY);
      // Lưu thông tin giã mã được vào đối tượng req, dùng cho các xử lý ở sau
      req.decoded = decoded;
      next();
    } catch (err) {
      // Giải mã gặp lỗi: Không đúng, hết hạn...
      console.error(err);
      return res.status(401).json({
        message: 'Unauthorized access.',
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
}
router.post("/test",TokenCheckMiddleware, (req, res) => {
   
  return res.status(200).json({"token":req.decoded})
});
router.use(TokenCheckMiddleware)
router.post("/welcome", (req, res) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
  
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        var decoded = jwt.verify(token, process.env.TOKEN_KEY);
        res.status(200).send(decoded.user);
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
   
});

app.use('/', router);
module.exports = app;