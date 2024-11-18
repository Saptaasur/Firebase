import express, { Request, Response } from "express";
import * as admin from "firebase-admin";
import { validateRegistration, validateUserUpdate } from "./validators";

const db = admin.firestore();
const router = express.Router();

// User Registration
router.post(
  "/register",
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = validateRegistration(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    try {
      const { email, password, name } = value;
      const user = await admin.auth().createUser({ email, password });

      await db.collection("users").doc(user.uid).set({ name, email });

      res.status(201).json({
        uid: user.uid,
        message: "User registered successfully.",
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : "Unknown error occurred" });
    }
  }
);

// User Edit
router.put(
  "/edit/:uid",
  async (req: Request, res: Response): Promise<void> => {
    const { uid } = req.params;
    const { error, value } = validateUserUpdate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    try {
      const userDoc = db.collection("users").doc(uid);
      const userSnapshot = await userDoc.get();

      if (!userSnapshot.exists) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      await userDoc.update(value);
      res.status(200).json({ message: "User updated successfully." });
    } catch (err) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : "Unknown error occurred" });
    }
  }
);

// User Delete
router.delete(
  "/:uid",
  async (req: Request, res: Response): Promise<void> => {
    const { uid } = req.params;

    try {
      const userDoc = db.collection("users").doc(uid);
      const userSnapshot = await userDoc.get();

      if (!userSnapshot.exists) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      await admin.auth().deleteUser(uid);
      await userDoc.delete();

      res.status(200).json({ message: "User deleted successfully." });
    } catch (err) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : "Unknown error occurred" });
    }
  }
);

export default router;
