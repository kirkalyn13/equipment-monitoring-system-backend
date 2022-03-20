"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const csv = __importStar(require("fast-csv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_cron_1 = __importDefault(require("node-cron"));
const moment_1 = __importDefault(require("moment"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3005;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
//Connect to SQL Database
const db = mysql_1.default.createConnection({
    user: 'testuser',
    password: 'test123',
    host: 'localhost',
    database: 'equipmentdb',
    dateStrings: true
});
//Login
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const usersQuery = 'SELECT * FROM userTable';
    console.log(`Requesting Access: ${username}`);
    db.query(usersQuery, async (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            const allUsers = result;
            const usernames = allUsers.map(user => user.username);
            if (usernames.includes(username)) {
                const userRef = allUsers.filter(user => user.username === username);
                try {
                    const login = await bcrypt_1.default.compare(password, userRef[0].password);
                    if (login) {
                        console.log(`User Login: ${username}`);
                        res.send({
                            username: username,
                            role: userRef[0].role,
                            login: true,
                        });
                    }
                    else {
                        console.log("Access Denied: Invalid Credentials.");
                        res.send({
                            username: '',
                            role: '',
                            login: false,
                        });
                    }
                }
                catch {
                    res.status(400).send("User Not Found.");
                }
            }
            else {
                console.log("Access Denied: Invalid Credentials.");
                res.send({
                    username: '',
                    role: '',
                    login: false,
                });
            }
        }
    });
});
//Get All Equipment
app.get('/allequipment', (req, res) => {
    const equipmentQuery = 'SELECT * FROM equipment';
    db.query(equipmentQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
            console.log("Queried Equipment Data.");
        }
    });
});
//Get Single Equipment
app.get('/equipment/:id', (req, res) => {
    const equipmentQuery = `SELECT * FROM equipment WHERE id = ${req.params.id}`;
    db.query(equipmentQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
            console.log(`Equipment ${req.params.id} Info.`);
        }
    });
});
//Add New Equipment
app.post('/create', (req, res) => {
    const eqpName = req.body.eqpName;
    const eqpType = req.body.eqpType;
    const eqpModel = req.body.eqpModel;
    const eqpSerial = req.body.eqpSerial;
    const eqpDesc = req.body.eqpDesc;
    const eqpBrand = req.body.eqpBrand;
    const eqpPrice = req.body.eqpPrice;
    const eqpManufacturer = req.body.eqpManufacturer;
    const eqpExp = req.body.eqpExp;
    const eqpPurchaseDate = req.body.eqpPurchaseDate;
    const eqpCalibDate = req.body.eqpCalibDate;
    const eqpNextCalib = req.body.eqpNextCalib;
    const eqpCalibMethod = req.body.eqpCalibMethod;
    const eqpLoc = req.body.eqpLoc;
    const eqpIssuedBy = req.body.eqpIssuedBy;
    const eqpIssuedTo = req.body.eqpIssuedTo;
    const eqpRemarks = req.body.eqpRemarks;
    const eqpStatus = req.body.eqpStatus;
    const eqpCertificate = req.body.eqpCertificate;
    const eqpImage = req.body.eqpImage;
    const inputValues = [eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer,
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, eqpImage];
    const addQuery = 'INSERT INTO equipment (`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`, `image`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ,? ,?)';
    db.query(addQuery, inputValues, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            const responseQuery = `SELECT id FROM equipment ORDER BY id DESC LIMIT 1`;
            db.query(responseQuery, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(result);
                }
            });
        }
    });
});
//Delete Equipment
app.delete('/delete/:id', (req, res) => {
    const deleteQuery = `DELETE FROM equipment WHERE id = ${req.params.id}`;
    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send("Equipment deleted.");
            console.log(`Deleted Equipment ID: ${req.params.id}`);
        }
    });
});
//Edit Equipment
app.put('/edit/:id', (req, res) => {
    const eqpName = req.body.eqpName;
    const eqpType = req.body.eqpType;
    const eqpModel = req.body.eqpModel;
    const eqpSerial = req.body.eqpSerial;
    const eqpDesc = req.body.eqpDesc;
    const eqpBrand = req.body.eqpBrand;
    const eqpPrice = req.body.eqpPrice;
    const eqpManufacturer = req.body.eqpManufacturer;
    const eqpExp = req.body.eqpExp;
    const eqpPurchaseDate = req.body.eqpPurchaseDate;
    const eqpCalibDate = req.body.eqpCalibDate;
    const eqpNextCalib = req.body.eqpNextCalib;
    const eqpCalibMethod = req.body.eqpCalibMethod;
    const eqpLoc = req.body.eqpLoc;
    const eqpIssuedBy = req.body.eqpIssuedBy;
    const eqpIssuedTo = req.body.eqpIssuedTo;
    const eqpRemarks = req.body.eqpRemarks;
    const eqpStatus = req.body.eqpStatus;
    const eqpCertificate = req.body.eqpCertificate;
    const eqpImage = req.body.eqpImage;
    const updateQuery = `UPDATE equipment SET name='${eqpName}',type='${eqpType}',model='${eqpModel}',serial='${eqpSerial}',
    description='${eqpDesc}',brand='${eqpBrand}',price='${eqpPrice}',manufacturer='${eqpManufacturer}',
    expiration='${eqpExp}',purchaseDate='${eqpPurchaseDate}',calibrationDate='${eqpCalibDate}',calibrationMethod='${eqpCalibMethod}',
    nextCalibration='${eqpNextCalib}',location='${eqpLoc}',issuedBy='${eqpIssuedBy}',issuedTo='${eqpIssuedTo}',remarks='${eqpRemarks}' ,
    status='${eqpStatus}',certificate='${eqpCertificate}',image='${eqpImage}' WHERE id = ${req.params.id}`;
    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
            console.log(`Edited Equipment ${eqpName} (${eqpSerial}).`);
        }
    });
});
//Download Certificate
app.get('/certificate/:id', (req, res) => {
    const downloadQuery = `SELECT certificate FROM equipment WHERE id = ${req.params.id}`;
    db.query(downloadQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            const file = result;
            const filename = `certificate_${req.params.id}.pdf`;
            res.set('Content-disposition', 'attachment; filename=' + filename);
            res.set('Content-Type', 'application/octet-stream');
            res.send(file);
            console.log(`Downloaded Equipment ${req.params.id} Calibration Certificate.`);
        }
    });
});
//Download Certificate via changeLogs
app.get('/changelog/certificate/:id/:timestamp', (req, res) => {
    const downloadQuery = `SELECT certificate FROM changeLogs WHERE id = ${req.params.id} AND timestamp = '${req.params.timestamp}'`;
    db.query(downloadQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            const file = result;
            const filename = `certificate_${req.params.id}.pdf`;
            res.set('Content-disposition', 'attachment; filename=' + filename);
            res.set('Content-Type', 'application/octet-stream');
            res.send(file);
            console.log(`Downloaded Equipment ${req.params.id} (${req.params.timestamp}) Calibration Certificate.`);
        }
    });
});
//Log Equipment Changes
app.post('/changelog/:id', (req, res) => {
    const id = req.params.id;
    const eqpName = req.body.eqpName;
    const eqpType = req.body.eqpType;
    const eqpModel = req.body.eqpModel;
    const eqpSerial = req.body.eqpSerial;
    const eqpDesc = req.body.eqpDesc;
    const eqpBrand = req.body.eqpBrand;
    const eqpPrice = req.body.eqpPrice;
    const eqpManufacturer = req.body.eqpManufacturer;
    const eqpExp = req.body.eqpExp;
    const eqpPurchaseDate = req.body.eqpPurchaseDate;
    const eqpCalibDate = req.body.eqpCalibDate;
    const eqpNextCalib = req.body.eqpNextCalib;
    const eqpCalibMethod = req.body.eqpCalibMethod;
    const eqpLoc = req.body.eqpLoc;
    const eqpIssuedBy = req.body.eqpIssuedBy;
    const eqpIssuedTo = req.body.eqpIssuedTo;
    const eqpRemarks = req.body.eqpRemarks;
    const eqpStatus = req.body.eqpStatus;
    const eqpCertificate = req.body.eqpCertificate;
    const modifiedBy = req.body.modifiedBy;
    const inputValues = [id, eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer,
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, modifiedBy];
    const changeLogQuery = 'INSERT INTO changeLogs (`id`,`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`, `modifiedBy`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,?)';
    db.query(changeLogQuery, inputValues, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(`Logged ${eqpName} (${eqpSerial}) changes.`);
        }
    });
});
//Fetch Logs
app.get('/logs/:id', (req, res) => {
    const fetchQuery = `SELECT * FROM changeLogs WHERE id = ${req.params.id}`;
    db.query(fetchQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
            console.log("Queried All User Data.");
        }
    });
});
//Get All Users
app.get('/allusers', (req, res) => {
    const userQuery = 'SELECT * FROM userTable';
    db.query(userQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
            console.log("Queried All User Data.");
        }
    });
});
//Add User
app.post('/createuser', async (req, res) => {
    try {
        const username = req.body.username;
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, 10);
        const role = req.body.role;
        const inputValues = [username, hashedPassword, role];
        const newUserQuery = 'INSERT INTO userTable (`username`, `password`, `role`) VALUES (?, ?, ?)';
        db.query(newUserQuery, inputValues, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(`Added User: ${username}, with ${role} privileges.`);
            }
        });
    }
    catch {
        res.status(500).send();
    }
});
//Edit User
app.put('/edituser/:id', async (req, res) => {
    try {
        const username = req.body.username;
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, 10);
        const role = req.body.role;
        const updateQuery = `UPDATE userTable SET username='${username}',password='${hashedPassword}',role='${role}' WHERE id = ${req.params.id}`;
        db.query(updateQuery, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
                console.log(`Updated ${username}, with ${role} privileges.`);
            }
        });
    }
    catch {
        res.status(500).send();
    }
});
//Delete User
app.delete('/deleteuser/:id', (req, res) => {
    const deleteQuery = `DELETE FROM userTable WHERE id = ${req.params.id}`;
    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send("User deleted.");
            console.log(`Deleted User ${req.params.id}`);
        }
    });
});
//Extract Equipment File
app.post('/extract', (req, res) => {
    const shownColumns = req.body.shown;
    const shownString = Object.keys(Object.fromEntries(Object.entries(shownColumns).filter(entry => entry[1]))).toString();
    const columnQuery = shownString.replace(/show/g, "").split(",").map(col => col.charAt(0).toLowerCase() + col.slice(1)).toString().replace(",certificate", "").replace("certificate", "");
    let filterQuery = "";
    const columnFilter = req.body.dataFilter.column;
    const dataFilter = req.body.dataFilter.data;
    if (dataFilter !== "All") {
        filterQuery = ` WHERE ${columnFilter}='${dataFilter}'`;
    }
    const extractQuery = `SELECT ${columnQuery} FROM equipment${filterQuery}`;
    //console.log(extractQuery)
    db.query(extractQuery, (err, data, fields) => {
        if (err) {
            console.log(err);
        }
        else {
            const filename = `EquipmentList.csv`;
            const ws = fs_1.default.createWriteStream(filename);
            const jsonData = JSON.parse(JSON.stringify(data));
            csv.write(jsonData, { headers: true }).on("finish", function () {
                console.log(`Extracted ${filename}`);
            }).pipe(ws);
        }
        setTimeout(() => {
            const csvFile = 'EquipmentList.csv';
            const csvBase64 = fs_1.default.readFileSync(csvFile, { encoding: 'base64' });
            res.set('Content-disposition', 'attachment; filename=' + csvFile);
            res.set('Content-Type', 'text/csv');
            res.send('data:text/csv;base64,' + csvBase64);
        }, 1000);
    });
});
// Automated Pending Equipment For Calibration Update
node_cron_1.default.schedule("0 0 * * *", () => {
    console.log("Checking Equipment for due Calibrations...");
    const updateQuery = 'SELECT `id`, `nextCalibration`, `status` FROM equipment';
    db.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            const allEquipment = result;
            const workingEquipment = allEquipment.filter(val => val.status === "Working");
            const pending = workingEquipment.filter(val => -((0, moment_1.default)().diff(val.nextCalibration, "days")) <= 30);
            const pendingIDs = pending.map(val => val.id);
            for (let i = 0; i <= pendingIDs.length - 1; i++) {
                const updateQuery = `UPDATE equipment SET status='For Calibration' WHERE id = ${pendingIDs[i]}`;
                const infoQuery = `SELECT * FROM equipment WHERE id = ${pendingIDs[i]}`;
                db.query(updateQuery, (err, result) => {
                    if (err) {
                        console.log("No pending equipment...");
                    }
                    else {
                        console.log(`Updated Equipment ${pendingIDs[i]} to For Calibration Status.`);
                    }
                });
                db.query(infoQuery, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        const inputValues = [result[0].id, result[0].name, result[0].type, result[0].model, result[0].serial,
                            result[0].description, result[0].brand, result[0].price, result[0].manufacturer,
                            result[0].expiration, result[0].purchaseDate, result[0].calibrationDate, result[0].calibrationMethod, result[0].nextCalibration,
                            result[0].location, result[0].issuedBy, result[0].issuedTo,
                            result[0].remarks, result[0].status, result[0].certificate];
                        const insertQuery = 'INSERT INTO changeLogs (`id`,`name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ,?)';
                        db.query(insertQuery, inputValues, (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(`Logged Equipment ${pendingIDs[i]} changes.`);
                            }
                        });
                    }
                });
            }
        }
    });
});
app.listen(port, () => {
    console.log(`Equipment Management System Server is running on port ${port}...`);
});
