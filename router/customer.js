const express = require("express")
const multer = require("multer")
const app = express()
const models = require("../models/index")
const customer = models.customer
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,"./image/customer")
    },
    filename:(req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage: storage})

app.get("/", async(req, res) => {
    // ambil data
    customer.findAll()
        .then(customer => {
            res.json({
                data: customer
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/:customer_id", async(req, res) => {
    // ambil data by id
})

app.post("/", upload.single("image"), async(req, res) => {
    // insert data
    if (!req.file) {
        res.json({
            message: "no uploaded image"
        })
    } else {
        let data = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            image: req.file.filename
        }

        customer.create(data)
            .then(result => {
                res.json({
                    message: "data has been inserted",
                    data: result
                })
            })
            .catch(error => {
                message: error.message
            })
    }
})

app.put("/",upload.single("image"), async(req, res) => {
    // update data
    let param = {customer_id: req.body.customer_id}
    let data = {
        name: req.body.name,
        phone:req.body.phone,
        address:req.body.address
    }

    if(req.file){
        //mengambil data lama yang sesuai dengan parameter
        const row = customer.findOne({where:param})
        .then(result=>{
            //mengambil nama image
            let oldFileName = result.image

            //menghapus gambar lama
            let dir = path.join(__dirname, "../image",oldFileName)
            fs.unlink(dir, err => console.log(err))
        })
        .catch(error=> {
            console.log(error.message)
        })

        //dapatkan file gambar baru
        data.image = req.file.filename

        customer.update(data, ({where:param}))
        .then(result=> {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error=>{
            res.json({
                message: error.message
            })
        })
    }
})

app.delete("/:customer_id", async(req, res) => {
    // delete data
    try{
        let param = {customer_id: req.params.customer_id}
        //dapatkan data yang akan dihapus
        let result = await customer.findOne({where: param})
        //temukan file gambar
        let oldFileName = result.image

        //delete file gambar lama
        let dir = path.join(__dirname,"../image",oldFileName)
        fs.unlink(dir,err=> console.log(err))

        //hapus data dari tabel
        customer.destroy({where:param})
        .then(result=>{
            res.json({
                message:"data has been deleted"
            })
        })
        .catch(error=>{
            res.json({
                message:error.message
            })
        })


    } catch{
        res.json({
            message:error.message
        })
    }
})

module.exports = app