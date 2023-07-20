import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Breadcrumbs } from '@mui/material';
import { ValuesContext } from '../pages/Contexts';

export default function Preference() {

  const { globalValues } = useContext(ValuesContext);
  const { email, username, access_token } = globalValues;

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
  };
  //changing city's state
  const handleChangeState = (e) => {
    const newState = e.target.value;
    setCurrLocation((prevLocation) => ({ ...prevLocation, state: newState }))
  };
  //sending PATCH request with updated state
  const handleLocation = async (e) => {
    e.preventDefault();
    try {
      const toUpdate = {
        email: userData.email,
        location: { city: currLocation.city, state: currLocation.state },
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
        type: 'add'
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
        type: 'add'
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

  const handleDeleteArtist = async (artistToDelete) => {
    try {
      await fetch(`/api/preferences?email=${encodeURIComponent(userData.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, artists: artistToDelete, type: 'delete' }),
      });
      setCurrArtists((curr) => curr.filter((artist) => artist !== artistToDelete));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteGenre = async (genreToDelete) => {
    try {
      await fetch(`/api/preferences?email=${encodeURIComponent(userData.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, genres: genreToDelete, type: 'delete' }),
      });
      setCurrGenres((curr) => curr.filter((genre) => genre !== genreToDelete));
    } catch (err) {
      console.log(err);
    }
  };



  console.log('currArtists: ', currArtists)
  console.log('currGenres: ', currGenres)
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



          <div className="current">


            <div className="currentArtists">
              <h2>Artists:</h2>
              <div className="artistList">
                <ul>
                  {currArtists.map((artist, i) => (
                    <li key={i}>{artist}  <button onClick={() => handleDeleteArtist(artist)}>X</button></li>
                  ))}
                </ul>
              </div>
            </div>


            <div className="currentGenres">
              <h2>Genres:</h2>
              <div className="genreList">
                <ul>
                  {currGenres.map((genre, i) => (
                    <li key={genre + i}>{genre}  <button onClick={() => handleDeleteGenre(genre)}>X</button></li>
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
