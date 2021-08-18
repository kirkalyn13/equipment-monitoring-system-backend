const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const fs = require("fs")
const fastcsv = require("fast-csv")
const homedir = require('os').homedir()

const app = express()

app.use(cors())
app.use(express.json())

//Determine User's Home Directory
function getUserDownloads() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : '/Home'];
  }

const db = mysql.createConnection({
    user: 'testuser',
    password: 'test123',
    host: 'localhost',
    database: 'equipmentdb',
    dateStrings: 'date'

})

//Add New Equipment
app.post('/create', (req, res) => {
    const eqpName = req.body.eqpName
    const eqpType = req.body.eqpType
    const eqpModel = req.body.eqpModel
    const eqpSerial = req.body.eqpSerial
    const eqpDesc = req.body.eqpDesc
    const eqpBrand = req.body.eqpBrand
    const eqpPrice = req.body.eqpPrice
    const eqpManufacturer = req.body.eqpManufacturer
    const eqpExp = req.body.eqpExp
    const eqpPurchaseDate = req.body.eqpPurchaseDate
    const eqpCalibDate = req.body.eqpCalibDate
    const eqpNextCalib = req.body.eqpNextCalib
    const eqpCalibMethod = req.body.eqpCalibMethod
    const eqpLoc = req.body.eqpLoc
    const eqpIssuedBy = req.body.eqpIssuedBy
    const eqpIssuedTo = req.body.eqpIssuedTo
    const eqpRemarks = req.body.eqpRemarks
    const inputValues = [eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer, 
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks]

    db.query('INSERT INTO equipment (`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?,?, ?, ?,?, ?)', 
    inputValues, (err, result) =>{
        if(err){
            console.log(err)
        }else{
            res.send("New Equipment Added.")
        }
    })
})

//Delete Equipment
app.delete('/delete/:id',(req,res) =>{
    db.query(`DELETE FROM equipment WHERE indexNum = ${req.params.id}`, (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send("equipment deleted.")
        }
    })
})

//Get All Equipment
app.get('/allequipment', (req, res) =>{
    db.query('SELECT * FROM equipment',(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log(result)
        }
    })
})

//Edit Equipment
app.put('/edit/:id', (req, res) => {
    const eqpName = req.body.eqpName
    const eqpType = req.body.eqpType
    const eqpModel = req.body.eqpModel
    const eqpSerial = req.body.eqpSerial
    const eqpDesc = req.body.eqpDesc
    const eqpBrand = req.body.eqpBrand
    const eqpPrice = req.body.eqpPrice
    const eqpManufacturer = req.body.eqpManufacturer
    const eqpExp = req.body.eqpExp
    const eqpPurchaseDate = req.body.eqpPurchaseDate
    const eqpCalibDate = req.body.eqpCalibDate
    const eqpNextCalib = req.body.eqpNextCalib
    const eqpCalibMethod = req.body.eqpCalibMethod
    const eqpLoc = req.body.eqpLoc
    const eqpIssuedBy = req.body.eqpIssuedBy
    const eqpIssuedTo = req.body.eqpIssuedTo
    const eqpRemarks = req.body.eqpRemarks
    const updateQuery = `UPDATE equipment SET name='${eqpName}',type='${eqpType}',model='${eqpModel}',serial='${eqpSerial}',
    description='${eqpDesc}',brand='${eqpBrand}',price='${eqpPrice}',manufacturer='${eqpManufacturer}',
    expiration='${eqpExp}',purchaseDate='${eqpPurchaseDate}',calibrationDate='${eqpCalibDate}',calibrationMethod='${eqpCalibMethod}',
    nextCalibration='${eqpNextCalib}',location='${eqpLoc}',issuedBy='${eqpIssuedBy}',issuedTo='${eqpIssuedTo}',remarks='${eqpRemarks}' WHERE indexNum = ${req.params.id}`
    db.query(updateQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log(result)
        }
    })
})

//Extract Equipment File
app.get('/extract',(req,res) => {
    db.query("SELECT * FROM equipment", (err, data, fields) => {
        if(err){
            console.log(err)
            alert("Unable to download file.")
        }else{
            res.send("Extracting Equipment Data.")
            var dtnow = new Date()
            var y = dtnow.getFullYear()
            var m = dtnow.getMonth() + 1
            var n = dtnow.getDate()
            var h = dtnow.getHours()

            const path = getUserDownloads()
            const ws = fs.createWriteStream(`${path}/PhysicsLabEquipment_${y}${m}${n}${h}.csv`)
            const jsonData = JSON.parse(JSON.stringify(data))
            console.log("jsonData", jsonData)

            fastcsv
                .write(jsonData, { headers: true })
                .on("finish", function() {
                    console.log(`Extracted PhysicsLabEquipment_${y}${m}${n}${h}.csv to ${path}`);
                })
                .pipe(ws)
            }
  })
})

app.listen(3005, () => {
    console.log("Equipment Management System Server is running...")
})