const express = require("express")
const auth = express()
const md5 = require("md5")
// import model Admin
const models = require("../../models/index")
const admin = models.admin

// call jwt
const jwt = require("jsonwebtoken")
const SECRET_KEY = "mokleters" // bebas

auth.use(express.urlencoded({extended: true}))
auth.post("/", async(req,res) => {
    // menerima data login (username,password)
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    // cek data pada tabel admin
    let result = await admin.findOne({where: data})
    if(result){
        let payload = JSON.stringify(result)
        return res.json({
            data: result,
            token: jwt.sign(payload, SECRET_KEY) 
        })
    }
    return res.json({
        message: "Invalid username or password"
    })
})

module.exports = auth