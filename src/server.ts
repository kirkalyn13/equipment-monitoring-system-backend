import express, {Application, Request, Response} from 'express'
import mysql, { Connection } from 'mysql'
import cors from 'cors'
import fs from 'fs'
import * as csv from 'fast-csv'
import bcrypt from 'bcrypt'
import cron from 'node-cron'
import moment from 'moment'

const app: Application = express()
const port: string | number = process.env.PORT || 3005

app.use(cors())
app.use(express.json({limit: '50mb'}))

//Connect to SQL Database
const db: Connection = mysql.createConnection({
    user: 'testuser',
    password: 'test123',
    host: 'localhost',
    database: 'equipmentdb',
    dateStrings: true

})

//Login
app.post('/login', async (req: Request, res: Response) => {
    const username: string = req.body.username
    const password: string = req.body.password
    const usersQuery: string = 'SELECT * FROM userTable'
    console.log(`Requesting Access: ${username}`)
    db.query(usersQuery, async (err,result) => {
        if(err){
            console.log(err)
        }else{
            const allUsers: any[] = result
            const usernames: string[] = allUsers.map(user => user.username)
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
app.get('/allequipment', (req: Request, res: Response) =>{
    const equipmentQuery: string = 'SELECT * FROM equipment'
    db.query(equipmentQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log("Queried Equipment Data.")
        }
    })
})

//Get Single Equipment
app.get('/equipment/:id', (req: Request, res: Response) =>{
    const equipmentQuery: string = `SELECT * FROM equipment WHERE id = ${req.params.id}`
    db.query(equipmentQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log(`Equipment ${req.params.id} Info.`)
        }
    })
})

//Add New Equipment
app.post('/create', (req: Request, res: Response) => {
    const eqpName: string = req.body.eqpName
    const eqpType: string = req.body.eqpType
    const eqpModel: string = req.body.eqpModel
    const eqpSerial: string = req.body.eqpSerial
    const eqpDesc: string = req.body.eqpDesc
    const eqpBrand: string = req.body.eqpBrand
    const eqpPrice: number = req.body.eqpPrice
    const eqpManufacturer: string = req.body.eqpManufacturer
    const eqpExp: any = req.body.eqpExp
    const eqpPurchaseDate: any = req.body.eqpPurchaseDate
    const eqpCalibDate: any = req.body.eqpCalibDate
    const eqpNextCalib: any = req.body.eqpNextCalib
    const eqpCalibMethod: string = req.body.eqpCalibMethod
    const eqpLoc: string = req.body.eqpLoc
    const eqpIssuedBy: string = req.body.eqpIssuedBy
    const eqpIssuedTo: string = req.body.eqpIssuedTo
    const eqpRemarks: string = req.body.eqpRemarks
    const eqpStatus: string = req.body.eqpStatus
    const eqpCertificate: any = req.body.eqpCertificate
    const eqpImage: string = req.body.eqpImage
    const inputValues: any[] = [eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer, 
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, eqpImage]
    const addQuery: string = 'INSERT INTO equipment (`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`, `image`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ,? ,?)'
    db.query(addQuery, inputValues, (err, result) =>{
        if(err){
            console.log(err)
        }else{
            const responseQuery: string = `SELECT id FROM equipment ORDER BY id DESC LIMIT 1`
            db.query(responseQuery,(err,result) => {
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
app.delete('/delete/:id',(req: Request, res: Response) =>{
    const deleteQuery: string = `DELETE FROM equipment WHERE id = ${req.params.id}`
    db.query(deleteQuery, (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send("Equipment deleted.")
            console.log(`Deleted Equipment ID: ${req.params.id}`)
        }
    })
})


//Edit Equipment
app.put('/edit/:id', (req: Request, res: Response) => {
    const eqpName: string = req.body.eqpName
    const eqpType: string = req.body.eqpType
    const eqpModel: string = req.body.eqpModel
    const eqpSerial: string = req.body.eqpSerial
    const eqpDesc: string = req.body.eqpDesc
    const eqpBrand: string = req.body.eqpBrand
    const eqpPrice: number = req.body.eqpPrice
    const eqpManufacturer: string = req.body.eqpManufacturer
    const eqpExp: any = req.body.eqpExp
    const eqpPurchaseDate: any = req.body.eqpPurchaseDate
    const eqpCalibDate: any = req.body.eqpCalibDate
    const eqpNextCalib: any = req.body.eqpNextCalib
    const eqpCalibMethod: string = req.body.eqpCalibMethod
    const eqpForMaintenance: string = req.body.eqpForMaintenance
    const eqpLoc: string = req.body.eqpLoc
    const eqpIssuedBy: string = req.body.eqpIssuedBy
    const eqpIssuedTo: string = req.body.eqpIssuedTo
    const eqpRemarks: string = req.body.eqpRemarks
    const eqpStatus: string = req.body.eqpStatus
    const eqpCertificate: any = req.body.eqpCertificate
    const eqpImage: string = req.body.eqpImage
    const updateQuery: string = `UPDATE equipment SET name='${eqpName}',type='${eqpType}',model='${eqpModel}',serial='${eqpSerial}',
    description='${eqpDesc}',brand='${eqpBrand}',price='${eqpPrice}',manufacturer='${eqpManufacturer}',
    expiration='${eqpExp}',purchaseDate='${eqpPurchaseDate}',calibrationDate='${eqpCalibDate}',
    calibrationMethod='${eqpCalibMethod}',forMaintenance='${eqpForMaintenance}',
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
app.get('/certificate/:id', (req: Request, res: Response) =>{
    const downloadQuery: string = `SELECT certificate FROM equipment WHERE id = ${req.params.id}`
    db.query(downloadQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            const file: any = result
            const filename: string = `certificate_${req.params.id}.pdf`
            res.set('Content-disposition', 'attachment; filename=' + filename);
            res.set('Content-Type', 'application/octet-stream')
            res.send(file)
            console.log(`Downloaded Equipment ${req.params.id} Calibration Certificate.`)
        }
    })
})

//Download Certificate via changeLogs
app.get('/changelog/certificate/:id/:timestamp', (req: Request, res: Response) =>{
    const downloadQuery: string = `SELECT certificate FROM changeLogs WHERE id = ${req.params.id} AND timestamp = '${req.params.timestamp}'`
    db.query(downloadQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            const file: any = result
            const filename: string = `certificate_${req.params.id}.pdf`
            res.set('Content-disposition', 'attachment; filename=' + filename);
            res.set('Content-Type', 'application/octet-stream')
            res.send(file)
            console.log(`Downloaded Equipment ${req.params.id} (${req.params.timestamp}) Calibration Certificate.`)
        }
    })
})

//Log Equipment Changes
app.post('/changelog/:id', (req: Request, res: Response) => {
    const id: string = req.params.id
    const eqpName: string = req.body.eqpName
    const eqpType: string = req.body.eqpType
    const eqpModel: string = req.body.eqpModel
    const eqpSerial: string = req.body.eqpSerial
    const eqpDesc: string = req.body.eqpDesc
    const eqpBrand: string= req.body.eqpBrand
    const eqpPrice: number = req.body.eqpPrice
    const eqpManufacturer: string = req.body.eqpManufacturer
    const eqpExp: any = req.body.eqpExp
    const eqpPurchaseDate: any = req.body.eqpPurchaseDate
    const eqpCalibDate: any = req.body.eqpCalibDate
    const eqpNextCalib: any= req.body.eqpNextCalib
    const eqpCalibMethod: string = req.body.eqpCalibMethod
    const eqpForMaintenance: string = req.body.eqpForMaintenance
    const eqpLoc: string = req.body.eqpLoc
    const eqpIssuedBy: string = req.body.eqpIssuedBy
    const eqpIssuedTo: string = req.body.eqpIssuedTo
    const eqpRemarks: string = req.body.eqpRemarks
    const eqpStatus: string = req.body.eqpStatus
    const eqpCertificate: any = req.body.eqpCertificate
    const modifiedBy: string = req.body.modifiedBy
    const inputValues: any[] = [id, eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer, 
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib, eqpForMaintenance, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, modifiedBy]
    const changeLogQuery: string = 'INSERT INTO changeLogs (`id`,`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `forMaintenance`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`, `modifiedBy`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,?)'
    db.query(changeLogQuery, inputValues, (err, result) =>{
        if(err){
            console.log(err)
        }else{
            res.send(`Logged ${eqpName} (${eqpSerial}) changes.`)
        }
    })
})

//Fetch Logs
app.get('/logs/:id', (req: Request, res: Response) =>{
    const fetchQuery: string = `SELECT * FROM changeLogs WHERE id = ${req.params.id}`
    db.query(fetchQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log("Queried All User Data.")
        }
    })
})

//Get All Users
app.get('/allusers', (req: Request, res: Response) =>{
    const userQuery: string = 'SELECT * FROM userTable'
    db.query(userQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log("Queried All User Data.")
        }
    })
})

//Add User
app.post('/createuser', async (req: Request, res: Response) => {
    try{
        const username: string = req.body.username
        const hashedPassword: string = await bcrypt.hash(req.body.password, 10)
        const role: string = req.body.role
        const inputValues: string[] = [username, hashedPassword, role]
        const newUserQuery: string = 'INSERT INTO userTable (`username`, `password`, `role`) VALUES (?, ?, ?)'
        db.query(newUserQuery, inputValues, (err, result) =>{
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
app.put('/edituser/:id', async (req: Request, res: Response) => {
    try{
        const username: string = req.body.username
        const hashedPassword: string = await bcrypt.hash(req.body.password, 10)
        const role: string = req.body.role
        const updateQuery: string = `UPDATE userTable SET username='${username}',password='${hashedPassword}',role='${role}' WHERE id = ${req.params.id}`
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
app.delete('/deleteuser/:id',(req: Request, res: Response) =>{
    const deleteQuery: string = `DELETE FROM userTable WHERE id = ${req.params.id}`
    db.query(deleteQuery, (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send("User deleted.")
            console.log(`Deleted User ${req.params.id}`)
        }
    })
})

//Extract Equipment File
app.post('/extract',(req: Request, res: Response) => {
    const shownColumns: string = req.body.shown
    const shownString: string = Object.keys(Object.fromEntries(Object.entries(shownColumns).filter(entry => entry[1]))).toString()
    const columnQuery: string = shownString.replace(/show/g,"").split(",").map(col => col.charAt(0).toLowerCase()  + col.slice(1)).toString().replace(",certificate","").replace("certificate","")
    let filterQuery: string = ""
    const columnFilter: string = req.body.dataFilter.column
    const dataFilter: string = req.body.dataFilter.data
    if(dataFilter !== "All"){
        filterQuery = ` WHERE ${columnFilter}='${dataFilter}'`
    }
    const extractQuery: string = `SELECT ${columnQuery} FROM equipment${filterQuery}`
    //console.log(extractQuery)
    db.query(extractQuery, (err, data, fields) => {
        if(err){
            console.log(err)
        }else{
            const filename: string= `EquipmentList.csv`
            const ws = fs.createWriteStream(filename)
            const jsonData: any[] = JSON.parse(JSON.stringify(data))

            csv.write(jsonData, { headers: true }).on("finish", function() {
                console.log(`Extracted ${filename}`)
            }).pipe(ws)
            
            }
            setTimeout(() => {
                const csvFile: string = 'EquipmentList.csv'
                const csvBase64: any = fs.readFileSync(csvFile, {encoding: 'base64'})
                res.set('Content-disposition', 'attachment; filename=' + csvFile)
                res.set('Content-Type', 'text/csv')
                res.send('data:text/csv;base64,' + csvBase64)
            }, 1000)
            
  })
})

// Automated Pending Equipment For Calibration Update
cron.schedule("*/5 * * * *" , () => {
    console.log("Checking Equipment for due Calibrations...")
    const updateQuery: string = 'SELECT `id`, `nextCalibration`, `status` FROM equipment'
    db.query(updateQuery,(err,result) => {
        if(err){
            console.log(err)
        }else{
            const allEquipment: any[] = result
            const workingEquipment: any[] = allEquipment.filter(val => val.status === "Working")
            const pending: any[] = workingEquipment.filter(val => -(moment().diff(val.nextCalibration, "days")) <= 30)
            const pendingIDs: any[]  = pending.map(val => val.id)
            for(let i=0; i <= pendingIDs.length - 1; i ++){
                const updateQuery: string = `UPDATE equipment SET status='For Calibration' WHERE id = ${pendingIDs[i]}`
                const infoQuery: string = `SELECT * FROM equipment WHERE id = ${pendingIDs[i]}`
                db.query(updateQuery,(err,result) => {
                if(err){
                    console.log("No pending equipment...")
                }else{
                    console.log(`Updated Equipment ${pendingIDs[i]} to For Calibration Status.`)
                }
                })
                db.query(infoQuery, (err,result) => {
                    if(err){
                        console.log(err)
                    }else{
                        const inputValues: any[] = [result[0].id, result[0].name, result[0].type, result[0].model, result[0].serial, 
                            result[0].description, result[0].brand, result[0].price, result[0].manufacturer, 
                            result[0].expiration, result[0].purchaseDate, result[0].calibrationDate, result[0].calibrationMethod, result[0].nextCalibration, 
                            result[0].location, result[0].issuedBy, result[0].issuedTo, 
                            result[0].remarks, result[0].status, result[0].certificate]
                        const insertQuery: string = 'INSERT INTO changeLogs (`id`,`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ,?)'
                        db.query(insertQuery, inputValues, (err, result) =>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log(`Logged Equipment ${pendingIDs[i]} changes.`)
                        }
                    }
                )
                    }
            })
        }
    }
    })
})

app.listen(port, () => {
    console.log(`Equipment Management System Server is running on port ${port}...`)
})