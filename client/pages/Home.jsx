import React, { useEffect, useState, useContext } from 'react';
// import '../styles.css';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Breadcrumbs } from '@mui/material';
import { ValuesContext } from '../pages/Contexts';

// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css'; //added font import


export default function HomePage() {
  // const location = useLocation();
  const { globalValues } = useContext(ValuesContext);
  const { email, username, access_token } = globalValues;

  const [userData, setUserData] = useState({});
  const [artists, setArtists] = useState(['ye']);
  const [genres, setGenres] = useState(['genre']);

  // console.log('email: ', email);
  // console.log(typeof email);


  useEffect(() => {
    console.log('Global Values: ', globalValues)
    const fetchingArtists = async () => {
      try {
        const response = await fetch(
          `/api/home/artist?email=${email}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const artists = await response.json();
        console.log(artists)
        // setArtists(artists.artistShows);
        setArtists(artists);
      } catch (err) {
        throw new Error('Error with artist fetch request!', err);
      }
    };
    fetchingArtists();


    const fetchingGenres = async () => {
      try {
        const response = await fetch(
          `/api/home/genre?email=${email}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const genres = await response.json();
        console.log(genres);
        const returned = genres.slice(0, 30);
        console.log(returned);
        setGenres(returned);
      } catch (err) {
        throw new Error('Error with genre fetch request!', err);
      }
    };
    fetchingGenres();
  }, []); //added empty array
  // console.log(location.state);
  // console.log(artist)
  // console.log(genres);

  return (
    <div className="homePage">
      <div className="breadcrumb">
        <Breadcrumbs aria-label="breadcrumb">
          <p color="text.primary" className="breadcrumbs">
            HOME PAGE
          </p>
          <Link
            underline="hover"
            color="inherit"
            to="/preferences"
            state={{ email, username, access_token }}
          >
            PREFERENCES
          </Link>
        </Breadcrumbs>
      </div>
      <div className="home"> {`Welcome, ${username}!`}</div>


      <div className="showBox">
        <h1>Upcoming Shows In Your Area</h1>
        <div className="artistShows">
          <h2>Artist Shows</h2>
          {artists ? artists.map((artist) => (

            <Card key={artist.artist} className="card">
              <CardContent>
                <Typography variant="h5" component="h3">
                  {artist.artist}
                </Typography>
                <Typography variant="body1" component="p">
                  Genre: {artist.genre}
                </Typography>
                <Typography variant="body1" component="p">
                  Date: {artist.date}
                </Typography>
                <Typography variant="body1" component="p">
                  Location: {artist.venue}
                </Typography>
                <Typography variant="body1" component="p">
                  Price: {artist.price}
                </Typography>
              </CardContent>
            </Card>
          )): 'No artists'}
        </div>

        <div className="genreShows">
          <h2>Genre Shows</h2>
          {genres ? genres.map((genre) => (

            <Card key={genre.artist} className="card">
              <CardContent>
                <Typography variant="h5" component="h3">
                  {genre.artist}
                </Typography>
                <Typography variant="body1" component="p">
                  Genre: {genre.genre}
                </Typography>
                <Typography variant="body1" component="p">
                  Date: {genre.date}
                </Typography>
                <Typography variant="body1" component="p">
                  Location: {genre.venue}
                </Typography>
                <Typography variant="body1" component="p">
                  Price: {genre.price}
                </Typography>
              </CardContent>
            </Card>
          )): 'No Genres'}
        </div>
      </div>
    </div>
  );
}
