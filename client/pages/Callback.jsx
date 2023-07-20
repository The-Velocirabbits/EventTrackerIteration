import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ValuesContext } from '../pages/Contexts';


// user is redirected to '/callback' from spotify after entering their credentials
// if the user's credentials were authenticated, make get request to obtain refresh and access tokens from spotify
export default function Callback() {
  const navigate = useNavigate();
  const { setGlobalValues } = useContext(ValuesContext);


  useEffect(() => {
    const href = window.location.href;
    const index = href.indexOf('callback');
    const urlQuery = href.slice(index)
    console.log('urlQuery:', urlQuery)

    async function getData() {
      try {
        //~ pass it through checkState and getToken to get the access_token
        const response = await fetch(`/api/authentication/${urlQuery}`);
        const access_token = await response.json()
        console.log('callback:', access_token)

        //~ set global value to have updated access_token
        //TODO: set it to have updated email
        //setGlobalValues({access_token:access_token, email:'nacho.cheese999@gmail.com', username: 'currymonstanacho'})

        // //~ use access token to get profile data
        const headers = { 'Authorization': `Bearer ${access_token}` }
        const response2 = await fetch('https://api.spotify.com/v1/users/currymonstanacho',
          { headers: headers });
        const profile = await response2.json()
        console.log('PROFILE INFORMATION')
        console.log(profile)

        //~ get top artists
        // const response3 = await fetch('https://api.spotify.com/v1/me/top/artists', { headers: headers });
        // const topArtists = await response3.json()
        // console.log('TOP ARTISTS')
        // console.log(topArtists)

        const userInfo = await fetch('/api/authentication/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: access_token })
        });

        const userData = await userInfo.json();
        setGlobalValues({ access_token: userData.accessToken, email: userData.email, username: userData.username })
        let redirect = '';
        if (userData.exists === false){
          redirect = '/signup';
        } else {
          redirect = '/home';
        }
        navigate(redirect);
       
      }
      catch (err) {
        console.log(err)
      }
    }
    getData()
  }, []);

  return (
    <div className="signinPage">
      <div className="signin">
        <h2>Confirming Spotify account</h2>
        <p>Please wait...</p>
        {/* <button id="test" onClick={updateProgress}> Test Button </button> */}
      </div>
    </div>
  );
}