import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";
import { webcrypto } from "crypto";
import { generateRsaKeyPair, exportPubKey, exportPrvKey } from "../crypto"; // Importez les fonctions de crypto.ts


export type Node = { nodeId: number; pubKey: string };

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type NodeWithPrivateKey = Node & { privateKey: webcrypto.CryptoKey };

export type GetNodeRegistryBody = {
  nodes: Node[];
};

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  let nodesRegistry: Map<number, NodeWithPrivateKey> = new Map();

  _registry.post("/registerNode", async (req: Request, res: Response) => {
    const nodeId = req.body.nodeId;
    const { publicKey, privateKey } = await generateRsaKeyPair();
    const pubKeyBase64 = await exportPubKey(publicKey);

    nodesRegistry.set(nodeId, { nodeId, pubKey: pubKeyBase64, privateKey });
    res.json({ message: "Node registered successfully", nodeId, pubKey: pubKeyBase64 });
  });

  _registry.get("/getPrivateKey", async (req: Request, res: Response) => {
    const nodeId = parseInt(req.query.nodeId as string);
    const node = nodesRegistry.get(nodeId);
    if (node) {
      const privateKeyBase64 = await exportPrvKey(node.privateKey);
      res.json({ result: privateKeyBase64 });
    } else {
      res.status(404).send("Node not found");
    }
  });

  _registry.get("/getNodeRegistry", (req: Request, res: Response) => {
    const nodeList = Array.from(nodesRegistry.values()).map(({ nodeId, pubKey }) => ({ nodeId, pubKey }));
    res.json({ nodes: nodeList });
  });

  // TODO implement the status route
  // _registry.get("/status", (req, res) => {});
  _registry.get("/status", (req, res) => {
    res.send("live");
  });

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
