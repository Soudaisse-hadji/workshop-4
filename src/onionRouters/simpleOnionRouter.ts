import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT } from "../config";


// Variables pour stocker les informations
let lastReceivedEncryptedMessage: string | null = null;
let lastReceivedDecryptedMessage: string | null = null;
let lastMessageDestination: number | null = null;


export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  // TODO implement the status route
  // onionRouter.get("/status", (req, res) => {});
  onionRouter.get("/status", (req, res) => {
    res.send("live");
  });



  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  // Route pour obtenir le dernier message reçu crypté
onionRouter.get("/getLastReceivedEncryptedMessage", (req, res) => {
  res.json({ result: lastReceivedEncryptedMessage });
});

// Route pour obtenir le dernier message reçu décrypté
onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
  res.json({ result: lastReceivedDecryptedMessage });
});

// Route pour obtenir la destination du dernier message
onionRouter.get("/getLastMessageDestination", (req, res) => {
  res.json({ result: lastMessageDestination });
});



  return server;
}




