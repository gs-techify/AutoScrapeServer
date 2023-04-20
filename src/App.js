import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  FormControl,
  Select,
  Container,
  TextField,
  Button
} from '@mui/material';

function App() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(false);
  const [betsData, setBetsData] = useState([]);
  const [option, setOption] = useState(0);

  useEffect(() => {
    if (status) {
      const socket = io();
      socket.on("new bet", body => {
        console.log("------------new bet-----------------");
        if (body.isNew) {
          getAllData();
          notification(body);
        }
      });
      getAllData();
    }
  }, [status]);

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

  const getAllData = (optval) => {
    fetch('https://autorefresher.info/api/today_bets')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          console.log("Today's All Bets Data:", data);
          let resData = data;
          if (optval === 0) {
            setBetsData(data);
          } else if (optval === 1) {
            resData = resData.filter((item) =>
              item.sport.includes("NBA") ||
              item.sport.includes("Basketball")
            );
            setBetsData(resData);
          } else if (optval === 2) {
            resData = resData.filter((item) =>
              item.sport.includes("MLB") ||
              item.sport.includes("Football")
            );
            setBetsData(resData);
          } else {
            setBetsData(data);
          }
        } else {
          console.error("Internal Server Error:", data);
        }
      })
      .catch(error => {
        console.error("Error featching Data:", error);
      })
  }

  useEffect(() => {
    if (betsData && betsData.length > 0) {
      getAllData(option);
    }
  }, [option]);

  const handleChange = (event) => {
    setOption(event.target.value);
  }

  const login = () => {
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username,
        "password": password
      }),
      redirect: 'follow'
    };
    
    fetch("https://autorefresher.info/api/auth", requestOptions)
      .then(response => response.text())
      .then(result => {
        if (result === "true") {
          setStatus(true);
        } else {
          setStatus(false);
        }
      })
      .catch(error => setStatus(false));
  }

  return (
    <>
      {
        !status ?
          <Container
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
            }}
          >
            <FormControl>
              <TextField
                label='Username'
                placeholder='Enter username'
                variant='standard'
                onChange={(e) => { setUsername(e.target.value) }}
                fullWidth
                required
              />
              <TextField
                label='Password'
                placeholder='Enter password'
                variant='standard'
                type='password'
                onChange={(e) => { setPassword(e.target.value) }}
                style={{
                  marginTop: '8px'
                }}
                fullWidth
                required
              />
              <Button
                type='submit'
                color='primary'
                variant='outlined'
                onClick={login}
                style={{
                  marginTop: '8px'
                }}
                fullWidth
              >
                Sign in
              </Button>
            </FormControl>
          </Container>
          :
          <TableContainer component={Paper}>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={option}
                onChange={handleChange}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>NBA</MenuItem>
                <MenuItem value={2}>MLB</MenuItem>
              </Select>
            </FormControl>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>ID</TableCell>
                  <TableCell style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>DATA PLACED</TableCell>
                  <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>SPORT</TableCell>
                  <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>DESCRIPTION</TableCell>
                  <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>WIN AMOUNT</TableCell>
                  <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>WEBSITE</TableCell>
                  <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>USER</TableCell>
                  <TableCell align="right" style={{ fontSize: '0.8rem', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}>GROUP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {betsData && betsData.length > 0 && betsData.map((row, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell
                      style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }}
                      component="th"
                      scope="row"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }}
                      component="th"
                      scope="row"
                    >
                      {row.date_placed.split(".")[0].replace("T", " ")}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }}
                      align="right"
                    >
                      {row.sport}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px', textTransform: 'uppercase' }}
                      align="right"
                    >
                      {row.description}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }}
                      align="right"
                    >
                      {row.win_amount}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }}
                      align="right"
                    >
                      {row.website}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }}
                      align="right"
                    >
                      {row.user}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: '0.75rem', paddingTop: '3px', paddingBottom: '3px' }}
                      align="right"
                    >
                      {row.group}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      }
    </>
  );
}

export default App;
