import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

function App() {

  const [betsData, setBetsData] = useState([]);

  useEffect(() => {
    let socket = io();
    socket.on("new bet", body => {
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
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:4000/api/bets',
      headers: {},
    };

    axios.request(config)
      .then((response) => {
        console.log(response.data);
        setBetsData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
              <TableCell component="th" scope="row">{row.date_placed}</TableCell>
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
