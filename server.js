const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const fs = require("fs")
const fastcsv = require("fast-csv")
const bcrypt = require('bcrypt')

const app = express()

app.use(cors())
app.use(express.json())

//Determine User's Home Directory
function getUserDownloads() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : '/Home'];
  }


//Connect to SQL Database
const db = mysql.createConnection({
    user: 'testuser',
    password: 'test123',
    host: 'localhost',
    database: 'equipmentdb',
    dateStrings: 'date'

})

//Login
app.post('/login', async (req,res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(`Requesting Access: ${username}`)
    db.query('SELECT * FROM userTable', async (err,result) => {
        if(err){
            console.log(err)
        }else{
            const allUsers = result
            const usernames = allUsers.map(user => user.username)
            if(usernames.includes(username)){
                const userRef = allUsers.filter(user => user.username === username)
                try{
                    const login = await bcrypt.compare(password, userRef[0].password)
                    if(login){
                        console.log(`User Login: ${username}`)
                        res.send({
                            username: username,
                            role: userRef[0].role,
                            login: true,
                        })
                    }
                    else{
                        console.log("Access Denied: Invalid Credentials.")
                        res.send({
                            username: '',
                            role: '',
                            login: false,
                    })
                }
                }catch{
                    res.status(400).send("User Not Found.")
                }
            }else{
                console.log("Access Denied: Invalid Credentials.")
                res.send({
                    username: '',
                    role: '',
                    login: false,
                })
            }
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
            console.log("Queried Equipment Data.")
        }
    })
})

//Get Single Equipment
app.get('/equipment/:id', (req, res) =>{
    db.query(`SELECT * FROM equipment WHERE id = ${req.params.id}`,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log(`Equipment ${req.params.id} Info.`)
        }
    })
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
    const eqpStatus = req.body.eqpStatus
    const eqpCertificate = req.body.eqpCertificate
    const inputValues = [eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer, 
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate]

    db.query('INSERT INTO equipment (`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ,?)', 
    inputValues, (err, result) =>{
        if(err){
            console.log(err)
        }else{
            res.send(`Added ${eqpName} (${eqpSerial})..`)
        }
    })
})

//Log New Equipment
app.post('/create/changelog', (req, res) => {
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
    const eqpStatus = req.body.eqpStatus
    const eqpCertificate = req.body.eqpCertificate
    const inputValues = [eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer, 
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate]

    db.query('INSERT INTO changeLogs (`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ,?)', 
    inputValues, (err, result) =>{
        if(err){
            console.log(err)
        }else{
            res.send(`Added ${eqpName} (${eqpSerial}) data to changeLogs.`)
        }
    })
})



//Delete Equipment
app.delete('/delete/:id',(req,res) =>{
    db.query(`DELETE FROM equipment WHERE id = ${req.params.id}`, (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send("Equipment deleted.")
            console.log(`Deleted Equipment ID: ${req.params.id}`)
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
    const eqpStatus = req.body.eqpStatus
    const eqpCertificate = req.body.eqpCertificate
    const updateQuery = `UPDATE equipment SET name='${eqpName}',type='${eqpType}',model='${eqpModel}',serial='${eqpSerial}',
    description='${eqpDesc}',brand='${eqpBrand}',price='${eqpPrice}',manufacturer='${eqpManufacturer}',
    expiration='${eqpExp}',purchaseDate='${eqpPurchaseDate}',calibrationDate='${eqpCalibDate}',calibrationMethod='${eqpCalibMethod}',
    nextCalibration='${eqpNextCalib}',location='${eqpLoc}',issuedBy='${eqpIssuedBy}',issuedTo='${eqpIssuedTo}',remarks='${eqpRemarks}' ,
    status='${eqpStatus}',certificate='${eqpCertificate}'WHERE id = ${req.params.id}`
    db.query(updateQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log(`Edited Equipment ${eqpName} (${eqpSerial}).`)
        }
    })
})

//Log Equipment Changes
app.post('/changelog/:id', (req, res) => {
    const id = req.params.id
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
    const eqpStatus = req.body.eqpStatus
    const eqpCertificate = req.body.eqpCertificate
    const inputValues = [id, eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer, 
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate]

    db.query('INSERT INTO changeLogs (`id`,`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ,?)', 
    inputValues, (err, result) =>{
        if(err){
            console.log(err)
        }else{
            res.send(`Logged ${eqpName} (${eqpSerial}) changes.`)
        }
    })
})

//Fetch Logs
app.get('/logs/:id', (req, res) =>{
    db.query(`SELECT * FROM changeLogs WHERE id = ${req.params.id}`,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log("Queried All User Data.")
        }
    })
})

//Get All Users
app.get('/allusers', (req, res) =>{
    db.query('SELECT * FROM userTable',(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log("Queried All User Data.")
        }
    })
})

//Add User
app.post('/createuser', async (req, res) => {
    try{
        const username = req.body.username
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const role = req.body.role
        const inputValues = [username, hashedPassword, role]
        db.query('INSERT INTO userTable (`username`, `password`, `role`) VALUES (?, ?, ?)', 
        inputValues, (err, result) =>{
            if(err){
                console.log(err)
            }else{
                res.send(`Added User: ${username}, with ${role} privileges.`)
            }
        })
    }catch{
        res.status(500).send()
    }
})

//Edit User
app.put('/edituser/:id', async (req, res) => {
    try{
        const username = req.body.username
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const role = req.body.role
        const updateQuery = `UPDATE userTable SET username='${username}',password='${hashedPassword}',role='${role}' WHERE id = ${req.params.id}`
        db.query(updateQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log(`Updated ${username}, with ${role} privileges.`)
        }
    })
    }catch{
        res.status(500).send()
    }
})

//Delete User
app.delete('/deleteuser/:id',(req,res) =>{
    db.query(`DELETE FROM userTable WHERE id = ${req.params.id}`, (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send("User deleted.")
            console.log(`Deleted User ${req.params.id}`)
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