const spotifyController = {};
const { Users, CurrentUsers } = require('../models/userModels.js');
const request = require('request'); // "Request" library

//get request to SeatGeek based on user preferences
spotifyController.getTopArtists = async (req, res, next) => {
  console.log('inside spotifyController.getTopArtists')
  const accessToken = res.locals.accessToken;

  const searchParams = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  };
  const response = await fetch(
    'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=0',
    searchParams
  );
  const data = await response.json().items;
  const artistArray = [];
  data.forEach((el) => {
    artistArray.push(el.name);
  });
  res.locals.spotifyArtists = artistArray;

};

spotifyController.getAccountInfo = async (req, res, next) => {
  console.log('inside spotifyController.getAccountInfo')

  try {
    const accessToken = req.body.accessToken;
    console.log('getAccountInfo:', accessToken)

    const searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    };
    const response = await fetch('https://api.spotify.com/v1/me', searchParams);
    const data = await response.json();
    const { email, display_name } = data;
    res.locals.email = email;
    res.locals.username = display_name;
    console.log('getAccountInfo email:', email);
    console.log('getAccountInfo username:', display_name);
    return next();
  } catch (err) {
    return next({
      log: `spotifyController.getAccountInfo ERROR: trouble fetching spoitfy email`,
      message: {
        err: `spotifyController.getAccountInfo: ERROR: ${err}`,
      },
    });
  }
};

module.exports = spotifyController;

//--> Function below is a get request to search for a specific artist using user input that is not seen<--
//--> I was also terrible with catching errors, but functions to interact with spotify API must be async
// async function search() {

//--> searchParams is just building out "init" obj (2nd param in fetch req) that lets you control things about the fetch request.
//--> Check spotify docs to see the specific requirements they need in this 'init' obj depending on what you are requesting
//   var searchParams = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer ' + accessToken
//     }
//   }
//access supplied by OAuth
//! access token duration not known yet
//TODO: store user access token in database upon sign-in

//--> Creating a variable to store the response from this get request, the result was an **artist ID**
//--> the FETCH URL can be found on spotify's doc. The hard part is LOOKING AT THE URL SYNTAX + making sure the fetch 'init' options are correct
//   var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParams)
//     .then(res => res.json())
//     .then(data => {
//       console.log(data.artists.items[0]) <--- this console.log'd the *first* artist and their data that came up after searching for the user input on spotify's database
//       return data.artists.items[0].id <--- this returns the 'id' property for that specific artist NOTE: items is a huge array of artists that match the user input, organized by popularity/relevance
//     });
// }
//! pull top artists from spotify API
// initially generate top 5 artists and generes and add to preferences
