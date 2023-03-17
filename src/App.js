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

      console.log("betsData::", betsData);
      console.log("body::", body);

      let isExist = true;

      if (betsData.length > 0) {
        isExist = betsData.some(elem =>
          elem.date_placed === body.bet.date_placed &&
          elem.sport === body.bet.sport &&
          elem.description === body.bet.description &&
          elem.win_amount === body.bet.win_amount &&
          elem.website === body.bet.website &&
          elem.user === body.bet.user
        );
      } else {
        isExist = false;
      }

      console.log("isExist::", isExist);

      if (!isExist) {
        let bets = betsData.slice();
        bets.push(body.bet);
        setBetsData(bets);
      }
    });
  }, []);

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
