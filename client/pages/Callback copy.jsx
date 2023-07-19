import React, { useEffect, useState, useContext } from 'react';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import { FetchContext } from '../pages/Contexts';


// user is redirected to '/callback' from spotify after entering their credentials
// if the user's credentials were authenticated, make get request to obtain refresh and access tokens from spotify
export default function Callback() {
  //heavy CSS!
  
  const [email, setEmail] = useState('');
  const [fetched, setFetched] = useState(false);
  const navigate = useNavigate();
  const { globalFetch, setGlobalFetch } = useContext(FetchContext);
  // const routeChange = (path) =>{
  //     navigate(path);
  // }

  // get the redirect url path (this includes the code query we will need to send to spotify to retrieve user specific tokens)
  const href = window.location.href;
  console.log('href: ', href)
  const index = href.indexOf('callback');
  const path = '/api/authentication/' + href.slice(index);
  console.log('path: ', path);

  // use code in request query to get access and refresh tokens from spotify
  const getTokens = async () => {
    try {
      const response = await fetch(path, {
        method: 'GET',
        headers: {
          'Content-Type': 'Application/JSON',
        },
      });
      //   const initiateAuth = await response.status;
      console.log('getTokens fetch response: ', response);
      const accessToken = await response.json();
      // if (response.status === 200) {
      // }
      console.log('access Token:', accessToken);
      console.log(typeof accessToken);
      return checkUserType(accessToken);
    } catch (err) {
      return console.log(
        'error making fetch request to server to retrieve spotify tokens: ',
        err
      );
    }
  };

  // TODO: get user email from spotify and check db to see if user exists
  const checkUserType = async (accessToken) => {
    console.log('entered Callback.jsx checkUserType');
    //TODO: get request to spotify to get user email and server will check db for existing user
    try {
      const response = await fetch('api/authentication/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({ accessToken: accessToken }),
      });
      const checkUser = await response.json();
      console.log('checkUser', checkUser);
      /* response from back end
          {
            email: stringify,
            exists: true/false
          }
          */

      // // TEST
      // const checkUser = {
      //   email: 'bdiso',
      //   exists: false
      // }

      // const updatedEmail = setEmail(checkUser.email);
      console.log('updatedEmail: ', checkUser.email);
      console.log('checkUser obj: ', checkUser)
      let redirect = '';
      // TODO: check db for user email
      // if user is not in db
      if (checkUser.exists === false) {
        
        redirect = '/signup';
      }
      // if user already exists in db
      else if (checkUser.exists === true) {
        redirect = '/home';
      }
      console.log('redirect', redirect);
      return navigate(redirect, {
        state: {
          email: checkUser.email,
          accessToken: checkUser.accessToken,
          username: checkUser.username,
        },
      });
    } catch (err) {
      return console.log('error in checkUserType');
    }
  };

  useEffect(() => {
    if (globalFetch === false) {
      console.log('right before getTokens(), globalFetch value: ', globalFetch)
      setGlobalFetch(true);
      getTokens();
    }
  }, []);

  return (
    <div className="signinPage">
      <div className="signin">
        <h2>Confirming Spotify account</h2>
        <p>Please wait...</p>
      </div>
    </div>
  );
}