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

function App() {

  const [betsData, setBetsData] = useState([]);

  useEffect(() => {
    io().on("bet", body => {

      if (!("Notification" in window)) {
        console.log("Browser does not support desktop notification");
      } else {
        Notification.requestPermission();
      }

      if (body.isNew) {
        let title = body.bet.group + ", " + body.bet.website + " " + body.bet.user;
        let options = {
          body: body.bet.sport + ", " + body.bet.description + ", " + body.bet.date_placed + ", " + body.bet.win_amount
        };
        new Notification(title, options);
      }

      let bets = betsData.slice();

      console.log("betsData==", betsData);

      if (!bets.includes(body.bet)) {
        console.log("bets=====", bets);
        bets.push(body.bet);
      }
      
      console.log("bets after pushed new bet========", bets);

      setBetsData(bets);
    });
  }, [betsData]);

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
