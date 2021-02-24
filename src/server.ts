import 'reflect-metadata';
import express, { request, response } from 'express';
import "./database";

const app = express();

app.get("/", (request, response) => {
  return response.json({ message: "Hello World - NLW04"});
});

app.post("/", (request, response) => {
  return response.json({message : "Data saved with sucess!!"});
});

app.listen(3333, () => console.log("Server is running"));