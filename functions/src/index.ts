import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";

import userRoutes from "./user";
import notesRoutes from "./notes";

admin.initializeApp();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/notes", notesRoutes);

export const api = functions.https.onRequest(app);
