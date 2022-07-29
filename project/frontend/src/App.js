import './App.css';
//import socket io client
import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
//import timeago.js
import * as timeago from 'timeago.js';
//create a socket client
const socket = io('http://192.168.137.26:3001');
function App() {
  //create a state variable to store the data from the server
  const [serverList, setServerList] = useState([]);
  //get server list from the server via useeffect
  useEffect(() => {
    socket.on('serverList', (data) => {
      setServerList(data);
      console.log(data);
    });
  }, []);

  return (
    <div className="App">
      <h1>Server List</h1>
      <ul>
        {serverList.map((server) => (
          <li key={server.url}>
            <div className='server-name'>
            {server.name} <span className='server-status'><a href={server.url}>{server.url}</a></span>
            </div>
            <div className='server-status'>
            <span>
            {server.status==='up'?'🟢 ':'🔴 '}
            </span>
            {timeago.format(server.timestamp)}
            </div>
            
            
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
