const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const serverList = JSON.parse(fs.readFileSync("./serverList.json"));
const timeago = require("timeago.js");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST","UPDATE", "DELETE"],
  },
});
app.use(cors());

// every 5 seconds, test all servers to check if the servers are online
const healthcheck = async () => {
  for (let i = 0; i < serverList.length; i++) {
    if(!serverList[i].timestamp) {
      serverList[i].timestamp = new Date().getTime();
    }
    try{
      const response = await axios.get(serverList[i].url);
      if(response.status === 200) {
        console.log(`${serverList[i].url} is online since ${timeago.format
          (serverList[i].timestamp)}`);
         
          if (serverList[i].status !== 'up'){
            serverList[i].status = 'up';
            serverList[i].timestamp = Date.now();
          }
       }
      }
    catch(error){
      console.log(`${serverList[i].url} is offline since ${timeago.format
        (serverList[i].timestamp)}`);

      if (serverList[i].status !== 'down'){
        serverList[i].status = 'down';
        serverList[i].timestamp = Date.now();
      }
    }
  }
  fs.writeFileSync('serverList.json', JSON.stringify(serverList));
  io.emit('serverList', serverList);
}

setInterval(healthcheck, 500);




io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
