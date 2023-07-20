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
        const headers = { 'Authorization': `Bearer ${access_token}` }

        //~ pulling user info from db
        const userInfo = await fetch('/api/authentication/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: access_token })
        });
        const userData = await userInfo.json();

         //~ set global value to have updated information
        console.log('userData.location', userData.location)
        setGlobalValues({ access_token: userData.accessToken, email: userData.email, username: userData.username, profile_pic: userData.profile_pic, location: userData.location})
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