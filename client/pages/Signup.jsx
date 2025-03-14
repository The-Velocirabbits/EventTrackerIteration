import React, { useState, useEffect, useContext } from 'react';
// import '../styles.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ValuesContext } from '../pages/Contexts';

export default function Signup() {
  const [city, setUserCity] = useState('');
  const [state, setUserState] = useState('');
  const navigate = useNavigate();

  const { globalValues } = useContext(ValuesContext);
  const { email, username, access_token } = globalValues;

  const handleNewUser = async (email, access_token, username, e) => {

    e.preventDefault();
    try {
      const userCity = e.target.elements.city.value;
      setUserCity(userCity);
      const userState = e.target.elements.state.value;
      setUserState(userState);
      const signupReq = {
        email: email,
        username: username,
        accessToken: access_token,
        city: userCity,
        state: userState,
      };
      console.log('signUpReq:', signupReq);
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupReq),
      });
      if (!response.ok) {
        throw new Error('Failed to save user data.');
      }
      navigate('/preferences');
    } catch (err) {
      console.log('handleNewUser error:', err);
    }
  };

  return (
    <div className="signupPage">
      <div className="signup">
        <h1>It looks like you're new to EventTracker. Welcome!</h1>
        {/* send a post request to the database with the location */}
        {/* make sure to pass in email from OAuth as well! */}
        <form onSubmit={(e) =>
            handleNewUser(
              email,
              access_token,
              username,
              e
            )
          } autoComplete="off" id="signupinfo">
          <h4>add your location:</h4>
          <input
            name="city"
            type="text"
            placeholder="New York"
            required
          ></input>
          <br></br>
          <input name="state" type="text" placeholder="NY" required></input>
          <br></br>
          <br></br>
          <input className="Btn" type="submit" value="Add"></input>
        </form>
      </div>
    </div>
  );
}
