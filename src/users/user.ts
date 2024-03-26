import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

// Variables pour stocker les informations
let lastReceivedMessage: string | null = null;
let lastSentMessage: string | null = null;

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};


export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  // TODO implement the status route
  // _user.get("/status", (req, res) => {});
  _user.get("/status", (req, res) => {
    res.send("live");
  });

    // Route pour recevoir un message
  _user.post("/message", (req, res) => {
    const message = req.body.message;
    lastReceivedMessage = message; // Mettez à jour la variable avec le message reçu
    res.send("success");
  });

  _user.get("/getLastReceivedMessage", (req, res) => {
    res.json({ result: lastReceivedMessage });
  });

  _user.get("/getLastSentMessage", (req, res) => {
    res.json({ result: lastSentMessage });
  });

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });



  return server;
}
