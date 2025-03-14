import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Breadcrumbs } from '@mui/material';
import { ValuesContext } from '../pages/Contexts';
import { List } from './Lists.jsx'
import Webplay from './Webplay.jsx';


export default function HomePage() {
  const { globalValues } = useContext(ValuesContext);
  const { email, username, access_token, profile_pic, location } = globalValues;
  const [userData, setUserData] = useState({});
  const [artists, setArtists] = useState(['ye']);
  const [genres, setGenres] = useState(['genre']);


  useEffect(() => {
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
          <p color="text.primary" className="breadcrumbs">HOME PAGE</p>
          <Link
            underline="hover"
            color="inherit"
            to="/preferences"
          >
            PREFERENCES
          </Link>
        </Breadcrumbs>
      </div>
      <div className="home">
        <h2>{`Welcome, ${username}!`}</h2>
        {profile_pic ? <img className='profPic' src={profile_pic} /> : ''}
      </div>
      <div className='mainBox'>
        <List arr={artists} type='Artist' location={location} />
        <List arr={genres} type='Genre' location={location}/>
        <div id='webplay' className="showBox"><Webplay /></div>
      </div>
    </div>
  );
}

