/**
 * Initializes and exports a configured Firebase Admin SDK instance.
 *
 * @remarks
 * This module bootstraps the Firebase Admin SDK using service account
 * credentials sourced from environment variables. It should be imported
 * once during application startup and reused wherever Firebase services
 * (e.g., Authentication, Firestore) are required.
 *
 * The private key is normalized by replacing escaped newline characters
 * (`\\n`) with actual newline characters (`\n`), which is necessary when
 * storing multi-line keys in environment variables.
 *
 * Required environment variables:
 * - `FIREBASE_PROJECT_ID`
 * - `FIREBASE_CLIENT_EMAIL`
 * - `FIREBASE_PRIVATE_KEY`
 *
 * @throws {Error}
 * Throws if Firebase Admin fails to initialize due to invalid or missing
 * credentials.
 *
 * @returns The initialized Firebase Admin SDK instance.
 */
const admin = require('firebase-admin')
require('dotenv').config()

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')
  })
})

export default admin