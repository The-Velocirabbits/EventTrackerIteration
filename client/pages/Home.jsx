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
  //const { globalValues } = useContext(ValuesContext);
  //const { email, username, access_token } = globalValues;

  const [userData, setUserData] = useState({});
  const [artists, setArtists] = useState(['ye']);
  const [genres, setGenres] = useState(['genre']);

  const location = useLocation();
  const { email, accessToken, username } = location.state;

  useEffect(() => {
    //console.log('Global Values: ', globalValues)
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
        const returned = genres.slice(0, 30);
        setGenres(returned);
      } catch (err) {
        throw new Error('Error with genre fetch request!', err);
      }
    };
    fetchingGenres();
  }, []);
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
            state={{ email, username, accessToken }}
          >
            PREFERENCES
          </Link>
        </Breadcrumbs>
      </div>
      <div className="home"> {`Welcome, ${username}!`}</div>


      <div className='mainBox'>


        <div className="showBox">
          <h3>Upcoming Shows</h3>
          <div className='displayBoxes'>
            <div className="artistShows">
              <h2>Shows Filtered By Artist: </h2>
              <div className='overflowBox'>
                {artists ? artists.map((el) => (
                  <div key={el.artist} className="card">
                    <img src={el.imgUrl} />
                    <div>Artist: {el.artist}</div>
                    <div>Genre: {el.genre}</div>
                    <div>Date: {el.date}</div>
                    <div>Location: {el.venue}</div>
                    <div>Price: ${el.price}</div>
                  </div>
                )) : 'No artists'}
              </div>
            </div>
          </div>
        </div>



        <div className="showBox">
          <h3>Upcoming Shows</h3>
          <div className='displayBoxes'>
            <div className="artistShows">
              <h2>Shows Filtered By Genre</h2>
              <div className='overflowBox'>
                {genres ? genres.map((el) => (
                  <div key={el.artist} className="card">
                    <img src={el.imgUrl} />
                    <div>Artist: {el.artist}</div>
                    <div>Genre: {el.genre}</div>
                    <div>Date: {el.date}</div>
                    <div>Location: {el.venue}</div>
                    <div>Price: ${el.price}</div>
                  </div>
                )) : 'No artists'}
              </div>
            </div>
          </div>
        </div>



      </div>


    </div>
  );
}




// <div className="artistShows">
// <h2>Artist Shows</h2>
// {artists ? artists.map((artist) => (
//   <Card key={artist.artist} color='whie' className="card">
//     <CardContent>
//       <Typography variant="h5" component="h3">
//         {artist.artist}
//       </Typography>
//       <Typography variant="body1" component="p">
//         Genre: {artist.genre}
//       </Typography>
//       <Typography variant="body1" component="p">
//         Date: {artist.date}
//       </Typography>
//       <Typography variant="body1" component="p">
//         Location: {artist.venue}
//       </Typography>
//       <Typography variant="body1" component="p">
//         Price: {artist.price}
//       </Typography>
//     </CardContent>
//   </Card>
// )) : 'No artists'}
// </div>

// <div className="genreShows">
// <h2>Genre Shows</h2>
// {genres ? genres.map((genre) => (
//   <Card variant="outlined" key={genre.artist} className="card">
//     <CardContent>
//       <Typography variant="h5" component="h3" color="text.secondary">
//         {genre.artist}
//       </Typography>
//       <Typography variant="body1" component="p">
//         Genre: {genre.genre}
//       </Typography>
//       <Typography variant="body1" component="p">
//         Date: {genre.date}
//       </Typography>
//       <Typography variant="body1" component="p">
//         Location: {genre.venue}
//       </Typography>
//       <Typography variant="body1" component="p">
//         Price: {genre.price}
//       </Typography>
//     </CardContent>
//   </Card>
// )) : 'No Genres'}
// </div>