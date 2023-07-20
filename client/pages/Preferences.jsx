import React, { useEffect, useState, useContext } from 'react';
// import '../styles.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Breadcrumbs } from '@mui/material';
import { ValuesContext } from '../pages/Contexts';

export default function Preference() {
  // const location = useLocation();
  // console.log('location: ', location);
  const { globalValues } = useContext(ValuesContext);
  const { email, username, access_token } = globalValues;
  // const email = 'haliahaynes';

  const [userData, setUserData] = useState({});
  const [newArtist, setNewArtist] = useState('');
  const [currArtists, setCurrArtists] = useState([]);
  const [newGenre, setNewGenre] = useState('');
  const [currGenres, setCurrGenres] = useState([]);
  const [currLocation, setCurrLocation] = useState({ city: '', state: '' })


  useEffect(() => {
    const fetchingData = async () => {
      //~ use current email to get information on user
      // const email = currentUser.email;
      try {
        const response = await fetch(
          `/api/user?email=${email}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const data = await response.json();
        console.log('data: ', data)
        console.log(data.location.city)
        console.log(data.location.state)
        setUserData(data);
        setCurrLocation({ city: data.location.city, state: data.location.state })
        setCurrArtists(data.artists);
        setCurrGenres(data.genres);
      }
      catch (err) {
        throw new Error('error with currentUserInfo: ', err);
      }
    }
    fetchingData();
  }, []);

  //changing state's state
  const handleChangeCity = (e) => {
    const newCity = e.target.value;
    setCurrLocation((prevLocation) => ({ ...prevLocation, city: newCity }))
    // setUserData((curr) => ({
    //   ...curr,
    //   city: newCity,
    // }));
  };
  //changing city's state
  const handleChangeState = (e) => {
    const newState = e.target.value;
    setCurrLocation((prevLocation) => ({ ...prevLocation, state: newState }))
    // setUserData((curr) => ({
    //   ...curr,
    //   state: newState,
    // }));
  };
  //sending PATCH request with updated state
  const handleLocation = async (e) => {
    e.preventDefault();
    try {
      const toUpdate = {
        email: userData.email,
        location: { city: currLocation.city, state: currLocation.state },
        // location: { city: userData.location.city, state: userData.location.state },
      };
      await fetch(
        `/api/preferences?email=${encodeURIComponent(userData.email)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toUpdate),
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  //changing artistArr's state
  const handleChangeAddArtist = (e) => {
    const newArtist = e.target.value;
    setNewArtist(newArtist);
  };
  //sending a PATCH request with updated artists array
  const handleAddArtist = async (e) => {
    e.preventDefault();
    if (newArtist.trim() === '') return;
    if (currArtists.includes(newArtist)) {
      setNewArtist('');
      return;
    }
    try {
      const addInfo = {
        email: userData.email,
        artists: newArtist,
      };
      await fetch(
        `/api/preferences?email=${encodeURIComponent(userData.email)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addInfo),
        }
      );
      setCurrArtists((curr) => [...curr, newArtist]);
      setNewArtist('');
    } catch (err) {
      console.log(err);
    }
  };
  //changing genre's state
  const handleChangeAddGenre = (e) => {
    const newGenre = e.target.value;
    setNewGenre(newGenre);
  };
  //sending a PATCH request with updated genre array
  const handleAddGenre = async (e) => {
    e.preventDefault();
    if (newGenre.trim() === '') return;
    if (currGenres.includes(newGenre)) {
      setNewGenre('');
      return;
    }
    try {
      const addInfo = {
        email: userData.email,
        genres: newGenre,
      };
      await fetch(
        `/api/preferences?email=${encodeURIComponent(userData.email)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addInfo),
        }
      );
      setCurrGenres((curr) => [...curr, newGenre]);
      setNewGenre('');
    } catch (err) {
      console.log(err);
    }
  };

  console.log('currArtists: ', currArtists)
  // setCurrArtists([])
  console.log('currGenres: ', currGenres)
  // setCurrGenres([])
  // console.log('locations1', userData.locations)
  console.log('locations2: ', currLocation)

  return (
    <div className="preferencesPage">
      <div className="breadcrumb">
        <Breadcrumbs aria-label="breadcrumb">
          <p color="text.primary" className="breadcrumbs">
            PREFERENCES
          </p>
          <Link to="/home">HOME PAGE</Link>
        </Breadcrumbs>
      </div>
      <div className="preferences">
        <div className="userInfo">
          <div className="basicInfo">
            <h1>Basic Info</h1>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <p>City: {currLocation.city}</p>
            <p>State: {currLocation.state}</p>
            {/* add update function! */}
          </div>
          <div>
            <div className="updateLocation">
              <p>to update location:</p>
              <form onSubmit={handleLocation} autoComplete="off">
                <div className="addCity">
                  <p>New City:</p>
                  <input
                    name="newCity"
                    type="text"
                    placeholder="New City"
                    required
                    onChange={handleChangeCity}
                  ></input>
                </div>
                <div className="addState">
                  <p>New State:</p>
                  <input
                    name="newState"
                    type="text"
                    placeholder="New State"
                    required
                    onChange={handleChangeState}
                  ></input>
                  <br></br>
                  <br></br>
                </div>
                <input className="Btn" type="submit" value="update"></input>
              </form>
            </div>
          </div>
        </div>
        <div className="music">
          <div className="add1">
            <div className="add">
              <form onSubmit={handleAddArtist} autoComplete="off">
                <div className="addArtists">
                  <h2>Add Artists:</h2>
                  <input
                    name="artistName"
                    type="text"
                    placeholder="Artist's Name"
                    required
                    onChange={handleChangeAddArtist}
                  ></input>
                  <br></br>
                </div>
                <input className="Btn" type="submit" value="add"></input>
              </form>
              <form onSubmit={handleAddGenre} autoComplete="off">
                <div className="addGenre">
                  <h2>Add Genre:</h2>
                  <input
                    name="genreName"
                    type="text"
                    placeholder="Genre Name"
                    required
                    onChange={handleChangeAddGenre}
                  ></input>
                  <br></br>
                </div>
                <input className="Btn" type="submit" value="add"></input>
              </form>
            </div>
          </div>
          <div className="current">
            <div className="currentArtists">
              <h2>Current Artists Tracked:</h2>
              <div className="artistList">
                <ul>
                  {currArtists.map((artist, i) => (
                    <li key={i}>{artist}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="currentGenres">
              <h2>Current Genres Tracked:</h2>
              <div className="genreList">
                <ul>
                  {currGenres.map((genre, i) => (
                    <li key={genre + i}>{genre}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
