const { seatgeek, google } = require('../models/secrets.js');

const seatGeekController = {};

//add this to end of any request url
// `?client_id=${seatgeek.client_id}&client_secret=${seatgeek.client_secret}`

//get request to SeatGeek based on user artist preferences
seatGeekController.getArtistEvents = async (req, res, next) => {
  try {
    const eventsArray = [];
    const artists = res.locals.userInfo.artists;
    const city = res.locals.userInfo.location.city;
    const state = res.locals.userInfo.location.state
    //const artists = ['ice-spice', 'all-them-witches', 'clutch'];
    //const city = 'Denver';

    //generating constants for todays date and date three months from now in API format
    const date = new Date();
    const today = date.toJSON().slice(0, 10);
    const threeMonths = new Date(date.setMonth(date.getMonth() + 3))
      .toJSON()
      .slice(0, 10);

    //itterating through each artist in array and fetching Event data
    for (let i = 0; i < artists.length; i++) {
      /*fetch to seatgeek API 
      query based on City, Artist, and date range of 3 Months
      */
      const artistString = artists[i].toLowerCase().replaceAll(' ', '-');
      //TODO: change this
      //~ get long and lat
      const noSpacesCity = city.replace(/\s/g, '');
      const locationResponse = fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${noSpacesCity},${state}&key=${google.api_key}`)
      console.log('LOCATION RESPONSE HERE: ', locationResponse)
      //~ get performers id
      // const performerResponse

      const zipcode = '10010'
      const response = await fetch(
        // `https://api.seatgeek.com/2/recommendations/?client_id=${seatgeek.client_id}&client_secret=${seatgeek.client_secret}&performers.slug=${artistString}&range=100&postal_code==${zipcode}&datetime_utc.gte=${today}&datetime_utc.lte=${threeMonths}`
        `https://api.seatgeek.com/2/events/?client_id=${seatgeek.client_id}&client_secret=${seatgeek.client_secret}&performers.slug=${artistString}&venue.city=${city}&datetime_utc.gte=${today}&datetime_utc.lte=${threeMonths}`
      );
      console.log('url fetching: ', `https://api.seatgeek.com/2/events/?client_id=${seatgeek.client_id}&client_secret=${seatgeek.client_secret}&performers.slug=${artistString}&venue.city=${city}&datetime_utc.gte=${today}&datetime_utc.lte=${threeMonths}`)
      const { events } = await response.json();
      console.log(events);
      //making a separate object for each event returned back for an artist
      events.forEach((el) => {
        const event = {
          artist: el.performers[0].name,
          genre: el.performers[0].genres[1].name,
          price: el.stats.lowest_price,
          date: el.datetime_local,
          venue: el.venue.name,
          eventUrl: el.url,
          imgUrl: el.performers[0].image,
        };
        eventsArray.push(event);
      });
    }
    //attaching Array of objects to send as response to front end
    res.locals.artistEvents = eventsArray;
    console.log('artist eventsArray length: ', eventsArray.length)

    return next();
  } catch (err) {
    return next({
      log: `seatGeekController.getArtistEvents ERROR: trouble fetching seatgeek events by artists`,
      message: {
        err: `seatGeekController.getArtistEvents: ERROR: ${err}`,
      },
    });
  }
};

seatGeekController.getGenreEvents = async (req, res, next) => {
  try {
    const eventsArray = [];
    const genre = res.locals.userInfo.genres;
    console.log('genre:', genre);
    const city = res.locals.userInfo.location.city;
    // const genre = 'rock';
    // const city = 'Denver';

    //generating constants for todays date and date three months from now in API format
    const date = new Date();
    const today = date.toJSON().slice(0, 10);
    const threeMonths = new Date(date.setMonth(date.getMonth() + 3))
      .toJSON()
      .slice(0, 10);

    /*fetch to seatgeek API 
      query based on City, Artist, and date range of 3 Months
      */
    for (let i = 0; i < genre.length; i++) {
      const response = await fetch(
        `https://api.seatgeek.com/2/events/?client_id=${seatgeek.client_id}&client_secret=${seatgeek.client_secret}&q=${genre[i]}&venue.city=${city}&datetime_utc.gte=${today}&datetime_utc.lte=${threeMonths}&per_page=25`
      );
      const { events } = await response.json();
      //making a separate object for each event returned back for an artist
      events.forEach((el) => {
        const event = {
          artist: el.performers[0].name,
          genre: genre[i],
          price: el.stats.lowest_price,
          date: el.datetime_local,
          venue: el.venue.name,
          eventUrl: el.url,
          imgUrl: el.performers[0].image,
        };
        eventsArray.push(event);
      });
    }

    //attaching Array of objects to send as response to front end
    res.locals.genreEvents = eventsArray;
    return next();
  } catch (err) {
    return next({
      log: `seatGeekController.getGenreEvents ERROR: trouble fetching seatgeek events by genre`,
      message: {
        err: `seatGeekController.getGenreEvents: ERROR: ${err}`,
      },
    });
  }
};

module.exports = seatGeekController;
