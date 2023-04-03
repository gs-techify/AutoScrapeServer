import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import io from 'socket.io-client';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// const http = require('follow-redirects').http;

function App() {
  
  const [betsData, setBetsData] = useState([]);
  
  useEffect(() => {
    const socket = io();
    socket.on("new bet", body => {
      console.log("------------new bet-----------------");
      if (body.isNew) {
        getAllData();
        notification(body);
      }
    });
    getAllData();
  }, []);

  const notification = (new_data) => {
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }

    let title = new_data.bet.group + ", " + new_data.bet.website + " " + new_data.bet.user;
    let options = {
      body: new_data.bet.sport + ", " + new_data.bet.description + ", " + new_data.bet.date_placed + ", " + new_data.bet.win_amount
    };

    new Notification(title, options);
  }

  const getAllData = () => {
    console.log("--------------getting today's bets data-----------------");
      fetch('http://178.238.228.102:4000/api/today_bets')
      .then(response => response.json())
      .then(data => {
        console.log("today's bets data::", data);
        setBetsData(data);
      })
      .catch(error => {
        console.log("Error featching Data:", error);
      })

    // let options = {
    //   'method': 'GET',
    //   'hostname': '178.238.228.102',
    //   'port': 4000,
    //   'path': '/api/bets',
    //   'headers': {
    //     'Content-Type': 'application/json'
    //   },
    //   'maxRedirects': 20
    // };

    // let req = http.request(options, function (res) {
    //   var chunks = [];
    
    //   res.on("data", function (chunk) {
    //     chunks.push(chunk);
    //   });
    
    //   res.on("end", function (chunk) {
    //     var body = Buffer.concat(chunks);
    //     console.log(JSON.parse(body.toString()));
    //     setBetsData(JSON.parse(body.toString()));
    //   });
    
    //   res.on("error", function (error) {
    //     console.error(error);
    //   });
    // });

    // req.end();
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold' }}>DATA PLACED</TableCell>
            <TableCell align="right" style={{ fontWeight: 'bold' }}>SPORT</TableCell>
            <TableCell align="right" style={{ fontWeight: 'bold' }}>DESCRIPTION</TableCell>
            <TableCell align="right" style={{ fontWeight: 'bold' }}>WIN AMOUNT</TableCell>
            <TableCell align="right" style={{ fontWeight: 'bold' }}>WEBSITE</TableCell>
            <TableCell align="right" style={{ fontWeight: 'bold' }}>USER</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {betsData.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{moment(new Date(row.date_placed)).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
              <TableCell align="right">{row.sport}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.win_amount}</TableCell>
              <TableCell align="right">{row.website}</TableCell>
              <TableCell align="right">{row.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default App;
