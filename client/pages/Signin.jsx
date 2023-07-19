import React, { useEffect, useState } from 'react';
// import '../styles.css';


// TODO: this comment belongs on '/callback' page
// if user successfully signs in with spotify, then expect a response with a state parameter for us to compare to the one we randomly generated for the user in our get request

export default function Signin() {
  // const [state, setState] = useState('');
  const [url, setUrl] = useState('');
  const [fetched, setFetched] = useState(false);


  // fetch request to server to set random state and store on cookie and generate correct url for client to go to via Sign In button
  // ! client must go to link themseleves. you cannot make a request to the server to redirect them there otherwise will get cors error
  const redirectUrl = async () => {
    try {
      const response = await fetch('/api/authentication', {
        method: 'GET',
        headers: {
          'Content-Type': 'Application/JSON',
        },
      });
      const initiateAuth = await response.json();

      console.log('initiateAuth response from server: ', initiateAuth);
      console.log(typeof initiateAuth);

      setUrl('https://accounts.spotify.com/authorize?' + initiateAuth);
    } catch (err) {
      console.log('error in signing in: ', err);
    }
  };

  if (fetched === false) {
    setFetched(true);
    redirectUrl();
  }



  // let navigate = useNavigate();
  // const routeChange = () =>{
  //   navigate(url);
  // }

  const handleRedirect = () => {
    window.location.replace(url);
  };

  /*
const handleSignIn = async () => {
  // make get request to initiate oauth with spotify
  try {
    // get request for spotify's authentication page
    console.log('entered signin try');
    const intitiateAuth = await fetch('/api/authentication', {
      // mode: 'no-cors',
      method: 'GET',
      headers: {
        'Content-Type': 'Application/JSON'
      }
    })
    // if user successfully signs in with spotify, then expect a response with a state parameter for us to compare to the one we randomly generated for the user in our get request
    console.log( 'intitiateAuth response from spotify: ', intitiateAuth);

  } catch (err) {
    console.log('error in signing in: ', err);
  }
};
*/

  //heavy CSS!!

  return (
    <div className="signinPage">
      <div className="signin">
        {' '}
        <h1>Welcome to EventTracker</h1>
      </div>
      <p>
        Please{' '}
        <button type="button" onClick={handleRedirect}>
          Sign In
        </button>{' '}
        with Spotify to verify your account
      </p>
    </div>
  );
}