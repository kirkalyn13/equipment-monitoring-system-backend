const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const fs = require('fs')
const fastcsv = require('fast-csv')
const bcrypt = require('bcrypt')
const cron = require('node-cron')
const moment = require('moment')

const app = express()
const port = process.env.PORT || 3005

app.use(cors())
app.use(express.json({limit: '50mb'}))

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
    const eqpImage = req.body.eqpImage
    const inputValues = [eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer, 
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, eqpImage]

    db.query('INSERT INTO equipment (`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`, `image`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ,? ,?)', 
    inputValues, (err, result) =>{
        if(err){
            console.log(err)
        }else{
            db.query(`SELECT id FROM equipment ORDER BY id DESC LIMIT 1`,(err,result) => {
                if(err){
                    console.log(err)
                }else{
                    res.send(result)
                }
            })
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
    const eqpImage = req.body.eqpImage
    const updateQuery = `UPDATE equipment SET name='${eqpName}',type='${eqpType}',model='${eqpModel}',serial='${eqpSerial}',
    description='${eqpDesc}',brand='${eqpBrand}',price='${eqpPrice}',manufacturer='${eqpManufacturer}',
    expiration='${eqpExp}',purchaseDate='${eqpPurchaseDate}',calibrationDate='${eqpCalibDate}',calibrationMethod='${eqpCalibMethod}',
    nextCalibration='${eqpNextCalib}',location='${eqpLoc}',issuedBy='${eqpIssuedBy}',issuedTo='${eqpIssuedTo}',remarks='${eqpRemarks}' ,
    status='${eqpStatus}',certificate='${eqpCertificate}',image='${eqpImage}' WHERE id = ${req.params.id}`
    db.query(updateQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log(`Edited Equipment ${eqpName} (${eqpSerial}).`)
        }
    })
})

//Download Certificate
app.get('/certificate/:id', (req, res) =>{
    db.query(`SELECT certificate FROM equipment WHERE id = ${req.params.id}`,(err,result) => {
        if(err){
            console.log(err)
        }else{
            const file = result
            const filename = `certificate_${req.params.id}.pdf`
            res.set('Content-disposition', 'attachment; filename=' + filename);
            res.set('Content-Type', 'application/octet-stream')
            res.send(file)
            console.log(`Downloaded Equipment ${req.params.id} Calibration Certificate.`)
        }
    })
})

//Download Certificate via changeLogs
app.get('/changelog/certificate/:id/:timestamp', (req, res) =>{
    db.query(`SELECT certificate FROM changeLogs WHERE id = ${req.params.id} AND timestamp = '${req.params.timestamp}'`,(err,result) => {
        if(err){
            console.log(err)
        }else{
            const file = result
            const filename = `certificate_${req.params.id}.pdf`
            res.set('Content-disposition', 'attachment; filename=' + filename);
            res.set('Content-Type', 'application/octet-stream')
            res.send(file)
            console.log(`Downloaded Equipment ${req.params.id} (${req.params.timestamp}) Calibration Certificate.`)
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
app.post('/extract',(req,res) => {
    const shownColumns = req.body.shown
    const shownString = Object.keys(Object.fromEntries(Object.entries(shownColumns).filter(entry => entry[1] === true))).toString()
    const columnQuery = shownString.replace(/show/g,"").split(",").map(col => col.charAt(0).toLowerCase()  + col.slice(1)).toString().replace(",certificate","").replace("certificate","")

    let filterQuery = ""
    const columnFilter = req.body.dataFilter.column
    const dataFilter = req.body.dataFilter.data
    if(dataFilter !== "All"){
        filterQuery = ` WHERE ${columnFilter}='${dataFilter}'`
    }

    db.query(`SELECT ${columnQuery} FROM equipment${filterQuery}`, (err, data, fields) => {
        if(err){
            console.log(err)
            alert("Unable to download file.")
        }else{
            const filename = `EquipmentList.csv`
            const ws = fs.createWriteStream(filename)
            const jsonData = JSON.parse(JSON.stringify(data))
            //console.log("jsonData", jsonData)

            fastcsv.write(jsonData, { headers: true }).on("finish", function() {
                    console.log(`Extracted ${filename}`)
                }).pipe(ws)
            }
            setTimeout(() => {
                const csvFile = 'EquipmentList.csv'
                const csvBase64 = fs.readFileSync(csvFile, {encoding: 'base64'})
                res.set('Content-disposition', 'attachment; filename=' + csvFile)
                res.set('Content-Type', 'text/csv')
                res.send('data:text/csv;base64,' + csvBase64)
            }, 1000)
            
  })
})

// Automated Pending Equipment For Calibration Update
cron.schedule("0 0 * * *" , ()=>{
    console.log("Checking Equipment for due Calibrations...")
    db.query('SELECT `id`, `nextCalibration`, `status` FROM equipment',(err,result) => {
        if(err){
            console.log(err)
        }else{
            const allEquipment = result
            const workingEquipment = allEquipment.filter(val => val.status === "Working")
            const pending = workingEquipment.filter(val => -(moment().diff(val.nextCalibration, "days")) <= 30)
            const pendingIDs = pending.map(val => val.id)
            for(let i=0; i <= pendingIDs.length - 1; i ++){
                const updateQuery = `UPDATE equipment SET status='For Calibration' WHERE id = ${pendingIDs[i]}`
                db.query(updateQuery,(err,result) => {
                if(err){
                    console.log("No pending equipment...")
                }else{
                    console.log(`Updated Equipment ${pendingIDs[i]} to For Calibration Status.`)
                }
            })
        }
        }
    })
})

app.listen(port, () => {
    console.log(`Equipment Management System Server is running on port ${port}...`)
})