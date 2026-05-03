import express, {Application, Request, Response} from 'express'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'
import * as csv from 'fast-csv'
import bcrypt from 'bcrypt'
import cron from 'node-cron'
import moment from 'moment'
import { logger } from './util/logger'
import morgan from 'morgan'
import admin from './util/firebase'

const app: Application = express()
const port: string | number = process.env.PORT || 3005
dotenv.config()

app.use(cors({ 
  origin: [
    "https://sea-ems.vercel.app",
    "http://localhost:3000",
    "http://localhost:3005"
  ]
}))
app.use(morgan('combined', {stream: {write: (message) => logger.info(message.trim())}}))
app.use(express.urlencoded({limit: '64mb', extended: true}))
app.use(express.json({limit: '64mb'}))

/**
 * PostgreSQL connection pool.
 * Configuration is sourced from environment variables:
 * `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `DB_PORT`.
 */
const db = new Pool({
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // host: process.env.DB_HOST,
    // database: process.env.DB_NAME,
    // port: Number(process.env.DB_PORT),
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false }
})

/**
 * Retrieves all equipment records from the database.
 *
 * @route GET /api/v1/equipment
 * @returns {Promise<void>} Responds with an array of all equipment rows.
 */
app.get('/api/v1/equipment', async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT * FROM equipment ORDER BY id')
        res.send(result.rows)
        logger.info("Queried Equipment Data.")
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Retrieves a single equipment record by its ID.
 *
 * @route GET /api/v1/equipment/:id
 * @param req.params.id - The unique identifier of the equipment.
 * @returns {Promise<void>} Responds with the matching equipment row.
 */
app.get('/api/v1/equipment/:id', async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT * FROM equipment WHERE id = $1', [req.params.id])
        res.send(result.rows)
        logger.info(`Equipment ${req.params.id} Info.`)
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Adds a new equipment record to the database.
 *
 * @route POST /api/v1/equipment
 * @param req.body - Equipment fields including name, type, model, serial, description,
 * brand, price, manufacturer, expiration, purchaseDate, calibrationDate, nextCalibration,
 * calibrationMethod, location, issuedBy, issuedTo, remarks, status, certificate, and image.
 * @returns {Promise<void>} Responds with the newly created equipment's ID.
 */
app.post('/api/v1/equipment', async (req: Request, res: Response) => {
    const { eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer,
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpNextCalib, eqpCalibMethod,
        eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, eqpImage } = req.body
    const inputValues: any[] = [eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer,
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib,
        eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, eqpImage]
    const addQuery = `INSERT INTO equipment (name, type, model, serial, description, brand, price, manufacturer,
        expiration, purchaseDate, calibrationDate, calibrationMethod, nextCalibration, location,
        issuedBy, issuedTo, remarks, status, certificate, image)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING id`
    try {
        const result = await db.query(addQuery, inputValues)
        res.send(result.rows)
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Deletes an equipment record by its ID.
 *
 * @route DELETE /api/v1/equipment/:id
 * @param req.params.id - The unique identifier of the equipment to delete.
 * @returns {Promise<void>} Responds with a confirmation message.
 */
app.delete('/api/v1/equipment/:id', async (req: Request, res: Response) => {
    try {
        await db.query('DELETE FROM equipment WHERE id = $1', [req.params.id])
        res.send("Equipment deleted.")
        logger.info(`Deleted Equipment ID: ${req.params.id}`)
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Updates an existing equipment record by its ID.
 *
 * @route PUT /api/v1/equipment/:id
 * @param req.params.id - The unique identifier of the equipment to update.
 * @param req.body - Updated equipment fields. Accepts all equipment properties
 * including `eqpForMaintenance` flag.
 * @returns {Promise<void>} Responds with the updated equipment rows.
 */
app.put('/api/v1/equipment/:id', async (req: Request, res: Response) => {
    const { eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer,
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpNextCalib, eqpCalibMethod, eqpForMaintenance,
        eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, eqpImage } = req.body
    const updateQuery = `UPDATE equipment SET name=$1, type=$2, model=$3, serial=$4, description=$5,
        brand=$6, price=$7, manufacturer=$8, expiration=$9, purchaseDate=$10,
        calibrationDate=$11, calibrationMethod=$12, forMaintenance=$13, nextCalibration=$14,
        location=$15, issuedBy=$16, issuedTo=$17, remarks=$18, status=$19,
        certificate=$20, image=$21 WHERE id = $22`
    const inputValues: any[] = [eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice,
        eqpManufacturer, eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpForMaintenance,
        eqpNextCalib, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus,
        eqpCertificate, eqpImage, req.params.id]
    try {
        const result = await db.query(updateQuery, inputValues)
        res.send(result.rows)
        logger.info(`Edited Equipment ${eqpName} (${eqpSerial}).`)
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Downloads the calibration certificate for a given equipment record.
 *
 * @route GET /api/v1/equipment/:id/certificate
 * @param req.params.id - The unique identifier of the equipment.
 * @returns {Promise<void>} Responds with the certificate file as an octet-stream attachment
 * named `certificate_{id}.pdf`.
 */
app.get('/api/v1/equipment/:id/certificate', async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT certificate FROM equipment WHERE id = $1', [req.params.id])
        const filename = `certificate_${req.params.id}.pdf`
        res.set('Content-disposition', 'attachment; filename=' + filename)
        res.set('Content-Type', 'application/octet-stream')
        res.send(result.rows)
        logger.info(`Downloaded Equipment ${req.params.id} Calibration Certificate.`)
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Downloads a historical calibration certificate from the change logs.
 *
 * @route GET /api/v1/changelogs/:id/:timestamp/certificate
 * @param req.params.id - The equipment ID.
 * @param req.params.logId - The changelog ID.
 * @returns {Promise<void>} Responds with the certificate file as an octet-stream attachment.
 */
app.get('/api/v1/changelogs/:id/:logId/certificate', async (req: Request, res: Response) => {
    try {
        const result = await db.query(
            `SELECT certificate
             FROM changeLogs
             WHERE id = $1
             AND indexnum = $2`,
            [req.params.id, req.params.logId]
        )
        const filename = `certificate_${req.params.id}.pdf`
        res.set('Content-disposition', 'attachment; filename=' + filename)
        res.set('Content-Type', 'application/octet-stream')
        res.send(result.rows)
        logger.info(`Downloaded Equipment ${req.params.id} (${req.params.timestamp}) Calibration Certificate.`)
    } catch (err) {
        logger.error('Failed to download certificate', err)
    }
})

/**
 * Logs a snapshot of an equipment record's state to the change log.
 *
 * @route POST /api/v1/changelogs/:id
 * @param req.params.id - The equipment ID being logged.
 * @param req.body - All equipment fields at the time of the change, plus `modifiedBy`
 * to indicate which user triggered the update.
 * @returns {Promise<void>} Responds with a confirmation message including the equipment name and serial.
 */
app.post('/api/v1/changelogs/:id', async (req: Request, res: Response) => {
    const { eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand, eqpPrice, eqpManufacturer,
        eqpExp, eqpPurchaseDate, eqpCalibDate, eqpNextCalib, eqpCalibMethod, eqpForMaintenance,
        eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, modifiedBy } = req.body
    const inputValues: any[] = [req.params.id, eqpName, eqpType, eqpModel, eqpSerial, eqpDesc, eqpBrand,
        eqpPrice, eqpManufacturer, eqpExp, eqpPurchaseDate, eqpCalibDate, eqpCalibMethod, eqpNextCalib,
        eqpForMaintenance, eqpLoc, eqpIssuedBy, eqpIssuedTo, eqpRemarks, eqpStatus, eqpCertificate, modifiedBy]
    const changeLogQuery = `INSERT INTO changeLogs (id, name, type, model, serial, description, brand, price,
        manufacturer, expiration, purchaseDate, calibrationDate, calibrationMethod, nextCalibration,
        forMaintenance, location, issuedBy, issuedTo, remarks, status, certificate, modifiedBy)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`
    try {
        await db.query(changeLogQuery, inputValues)
        res.send(`Logged ${eqpName} (${eqpSerial}) changes.`)
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Retrieves all change log entries for a specific equipment record.
 *
 * @route GET /api/v1/changelogs/:id
 * @param req.params.id - The equipment ID whose logs are being fetched.
 * @returns {Promise<void>} Responds with an array of all changelog rows for the given ID.
 */
app.get('/api/v1/changelogs/:id', async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT * FROM changeLogs WHERE id = $1 ORDER BY timestamp', [req.params.id])
        res.send(result.rows)
        logger.info("Queried All Change Log Data.")
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Retrieves all users from the database.
 *
 * @route GET /users
 * @returns {Promise<void>} Responds with an array of all user rows.
 *
 * @deprecated Use the new authentication service endpoint instead.
 * This route exposes raw user data including hashed passwords and will be removed in a future release.
 */
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT * FROM userTable')
        res.send(result.rows)
        logger.info("Queried All User Data.")
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Creates a new user with a hashed password.
 *
 * @route POST /users
 * @param req.body.username - The new user's username.
 * @param req.body.password - The plaintext password (hashed with bcrypt before storage).
 * @param req.body.role - The role to assign to the user.
 * @returns {Promise<void>} Responds with a confirmation message.
 *
 * @deprecated Use the new authentication service for user creation.
 * Direct password hashing in this route will be removed in a future release.
 */
app.post('/users', async (req: Request, res: Response) => {
    try {
        const username: string = req.body.username
        const hashedPassword: string = await bcrypt.hash(req.body.password, 10)
        const role: string = req.body.role
        await db.query(
            'INSERT INTO userTable (username, password, role) VALUES ($1, $2, $3)',
            [username, hashedPassword, role]
        )
        res.send(`Added User: ${username}, with ${role} privileges.`)
    } catch (err) {
        logger.error(err)
        res.status(500).send()
    }
})

/**
 * Updates an existing user's credentials and role.
 *
 * @route PUT /users/:id
 * @param req.params.id - The ID of the user to update.
 * @param req.body.username - The updated username.
 * @param req.body.password - The new plaintext password (re-hashed with bcrypt).
 * @param req.body.role - The updated role.
 * @returns {Promise<void>} Responds with the updated user rows.
 *
 * @deprecated Use the new authentication service for user updates.
 * This route will be removed in a future release.
 */
app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const username: string = req.body.username
        const hashedPassword: string = await bcrypt.hash(req.body.password, 10)
        const role: string = req.body.role
        const result = await db.query(
            "UPDATE userTable SET username=$1, password=$2, role=$3 WHERE id = $4",
            [username, hashedPassword, role, req.params.id]
        )
        res.send(result.rows)
        logger.info(`Updated ${username}, with ${role} privileges.`)
    } catch (err) {
        logger.error(err)
        res.status(500).send()
    }
})

/**
 * Updates a user's authentication details.
 *
 * @route PUT /api/v1/users/:uid
 *
 * @param req - Express request object
 * @param req.params.uid - The unique identifier of the user to update
 * @param req.body.email - (Optional) New email address for the user
 * @param req.body.password - (Optional) New password for the user
 *
 * @param res - Express response object
 *
 * @returns {Promise<void>}
 * Responds with:
 * - `{ success: true }` on successful update
 * - `{ error: string }` with HTTP 500 if the update fails
 *
 * @remarks
 * - At least one of `email` or `password` must be provided; otherwise, no updates will be applied.
 * - Passwords are handled by Firebase Admin SDK and are securely hashed automatically.
 * - This endpoint directly calls `admin.auth().updateUser`, so it assumes Firebase Admin is properly initialized.
 *
 */
app.put('/api/v1/users/:uid', async (req, res) => {
  const { uid } = req.params
  const { email, password } = req.body
  
  const updates: any = {}
  if (email) updates.email = email
  if (password) updates.password = password

  try {
    await admin.auth().updateUser(uid, updates)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

/**
 * Deletes a user by their ID.
 *
 * @route DELETE /users/:id
 * @param req.params.id - The ID of the user to delete.
 * @returns {Promise<void>} Responds with a confirmation message.
 */
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        await db.query('DELETE FROM userTable WHERE id = $1', [req.params.id])
        res.send("User deleted.")
        logger.info(`Deleted User ${req.params.id}`)
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Deletes a user from the authentication system.
 *
 * @route DELETE /api/v1/users/:uid
 *
 * @param req - Express request object
 * @param req.params.uid - The unique identifier of the user to delete
 *
 * @param res - Express response object
 *
 * @returns {Promise<void>}
 * Responds with:
 * - `{ success: true }` on successful deletion
 * - `{ error: string }` with HTTP 500 if the deletion fails
 *
 * @remarks
 * - This operation permanently deletes the user from Firebase Authentication.
 * - This does NOT automatically delete related records in your application database (if any).
 * - Ensure cascading cleanup is handled separately if required.
 *
 */
app.delete('/api/v1/users/:uid', async (req, res) => {
  const { uid } = req.params

  try {
    await admin.auth().deleteUser(uid)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

/**
 * Authenticates a user against stored credentials.
 *
 * @route POST /login
 * @param req.body.username - The username attempting to log in.
 * @param req.body.password - The plaintext password to verify against the stored hash.
 * @returns {Promise<void>} Responds with an object containing `username`, `role`,
 * and `login` (boolean). Returns `login: false` on invalid credentials.
 *
 * @deprecated Use the new JWT-based authentication endpoint instead.
 * This route fetches all users to perform credential matching, which is inefficient
 * and insecure at scale. Will be removed in a future release.
 */
app.post('/login', async (req: Request, res: Response) => {
    const username: string = req.body.username
    const password: string = req.body.password
    logger.info(`Requesting Access: ${username}`)
    try {
        const result = await db.query('SELECT * FROM userTable')
        const allUsers: any[] = result.rows
        const userRef = allUsers.filter(user => user.username === username)
        if (userRef.length > 0) {
            const login = await bcrypt.compare(password, userRef[0].password)
            if (login) {
                logger.info(`User Login: ${username}`)
                res.send({
                    username: username,
                    role: userRef[0].role,
                    login: true,
                })
            } else {
                logger.info("Access Denied: Invalid Credentials.")
                res.send({ username: '', role: '', login: false })
            }
        } else {
            logger.info("Access Denied: Invalid Credentials.")
            res.send({ username: '', role: '', login: false })
        }
    } catch (err) {
        logger.error(err)
        res.status(400).send("User Not Found.")
    }
})

/**
 * Exports a filtered subset of equipment records as a CSV file.
 *
 * @route POST /api/v1/equipment/extract
 * @param req.body.shown - An object mapping column visibility flags (e.g. `showName: true`).
 * Certificate columns are automatically excluded from the export.
 * @param req.body.dataFilter - An object with `column` and `data` fields used to filter rows.
 * Pass `data: "All"` to export without filtering.
 * @returns {Promise<void>} Responds with the CSV file as a base64-encoded attachment.
 *
 * @remarks
 * The file is written to disk temporarily before being read and sent.
 * A 1-second delay is used to ensure the write completes before reading.
 * Consider replacing this with a stream-based approach for production use.
 */
app.post('/api/v1/equipment/extract', async (req: Request, res: Response) => {
    const shownColumns: string = req.body.shown
    const shownString: string = Object.keys(Object.fromEntries(Object.entries(shownColumns).filter(entry => entry[1]))).toString()
    const columnQuery: string = shownString.replace(/show/g,"").split(",").map(col => col.charAt(0).toLowerCase() + col.slice(1)).toString().replace(",certificate","").replace("certificate","")
    let filterQuery: string = ""
    const columnFilter: string = req.body.dataFilter.column
    const dataFilter: string = req.body.dataFilter.data
    if (dataFilter !== "All") {
        filterQuery = ` WHERE ${columnFilter}='${dataFilter}'`
    }
    const extractQuery: string = `SELECT ${columnQuery} FROM equipment${filterQuery}`
    try {
        const result = await db.query(extractQuery)
        const filename = `EquipmentList.csv`
        const ws = fs.createWriteStream(filename)
        const jsonData: any[] = JSON.parse(JSON.stringify(result.rows))
        csv.write(jsonData, { headers: true }).on("finish", function() {
            logger.info(`Extracted ${filename}`)
        }).pipe(ws)

        setTimeout(() => {
            const csvFile = 'EquipmentList.csv'
            const csvBase64: any = fs.readFileSync(csvFile, { encoding: 'base64' })
            res.set('Content-disposition', 'attachment; filename=' + csvFile)
            res.set('Content-Type', 'text/csv')
            res.send('data:text/csv;base64,' + csvBase64)
        }, 1000)
    } catch (err) {
        logger.error(err)
    }
})

/**
 * Scheduled cron job that runs every 5 minutes to check for equipment
 * approaching their calibration due date.
 *
 * @remarks
 * Queries all equipment with a `Working` status and flags any records
 * whose `nextCalibration` date falls within the next 30 days by updating
 * their status to `"For Calibration"`. Each updated record is also
 * automatically logged to the `changeLogs` table.
 */
cron.schedule("*/5 * * * *", async () => {
    logger.info("Checking Equipment for due Calibrations...")
    try {
        const result = await db.query("SELECT id, nextCalibration, status FROM equipment")
        const allEquipment: any[] = result.rows
        const workingEquipment = allEquipment.filter(val => val.status === "Working")
        const pending = workingEquipment.filter(val => -(moment().diff(val.nextCalibration, "days")) <= 30)
        const pendingIDs = pending.map(val => val.id)

        for (let i = 0; i <= pendingIDs.length - 1; i++) {
            try {
                await db.query("UPDATE equipment SET status='For Calibration' WHERE id = $1", [pendingIDs[i]])
                logger.info(`Updated Equipment ${pendingIDs[i]} to For Calibration Status.`)

                const infoResult = await db.query("SELECT * FROM equipment WHERE id = $1", [pendingIDs[i]])
                const r = infoResult.rows[0]
                const inputValues: any[] = [r.id, r.name, r.type, r.model, r.serial, r.description,
                    r.brand, r.price, r.manufacturer, r.expiration, r.purchaseDate,
                    r.calibrationDate, r.calibrationMethod, r.nextCalibration,
                    r.location, r.issuedBy, r.issuedTo, r.remarks, r.status, r.certificate]
                const insertQuery = `INSERT INTO changeLogs (id, name, type, model, serial, description, brand, price,
                    manufacturer, expiration, purchaseDate, calibrationDate, calibrationMethod, nextCalibration,
                    location, issuedBy, issuedTo, remarks, status, certificate)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`
                await db.query(insertQuery, inputValues)
                logger.info(`Logged Equipment ${pendingIDs[i]} changes.`)
            } catch (err) {
                logger.error(err)
            }
        }
    } catch (err) {
        logger.error(err)
    }
})

app.listen(port, () => {
    logger.info("DB_URL:", process.env.DB_URL);
    logger.info(`Equipment Management System Server is running on port ${port}...`)
})
