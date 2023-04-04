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
    fetch('https://autorefresher.info/api/today_bets')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          console.log("Today's bets data:", data);
          setBetsData(data);
        } else {
          console.error("Internal Server Error:", data);
        }
      })
      .catch(error => {
        console.error("Error featching Data:", error);
      })
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>DATA PLACED</TableCell>
            <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>SPORT</TableCell>
            <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>DESCRIPTION</TableCell>
            <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>WIN AMOUNT</TableCell>
            <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>WEBSITE</TableCell>
            <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>USER</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {betsData && betsData.length > 0 && betsData.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }} component="th" scope="row">{moment(new Date(row.date_placed)).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
              <TableCell style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }} align="right">{row.sport}</TableCell>
              <TableCell style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }} align="right">{row.description}</TableCell>
              <TableCell style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }} align="right">{row.win_amount}</TableCell>
              <TableCell style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }} align="right">{row.website}</TableCell>
              <TableCell style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }} align="right">{row.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default App;
