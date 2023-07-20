const { seatgeek, google } = require('../models/secrets.js');

const seatGeekController = {};

//add this to end of any request url
// `?client_id=${seatgeek.client_id}&client_secret=${seatgeek.client_secret}`

//get request to SeatGeek based on user artist preferences
seatGeekController.getArtistEvents = async (req, res, next) => {
  try {
    const eventsArray = [];
    const eventsURLs = new Set();
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

    //~ get location of user in lon and lat
    const noSpacesCity = city.replace(/\s/g, '');
    const googleURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${noSpacesCity},${state}&key=${google.api_key}`
    // console.log(googleURL)
    const locationResponse = await fetch(googleURL)
    const locationReturn = await locationResponse.json()
    // console.log(locationReturn.results[0].geometry)
    const { lng, lat } = locationReturn.results[0].geometry.location
    // console.log('coordinates: ',lng,lat)

    //itterating through each artist in array and fetching Event data
    for (let i = 0; i < artists.length; i++) {
      /*fetch to seatgeek API 
      query based on City, Artist, and date range of 3 Months
      */
      const artistString = artists[i].toLowerCase().replaceAll(' ', '-');
      //TODO: change this

      //~ get performers id
      const performerResponse = await fetch(`https://api.seatgeek.com/2/performers?slug=${artistString}&client_id=${seatgeek.client_id}`)
      const performerData = await performerResponse.json()
      console.log('PERFORMER DATA: ', performerData)
      const performerId = performerData.performers[0].id
      // console.log(performerData)
      // console.log(performerId)
      const fetchURL = `https://api.seatgeek.com/2/recommendations/?client_id=${seatgeek.client_id}&lat=${lat}&lon=${lng}&datetime_utc.gte=${today}&datetime_utc.lte=${threeMonths}&performers.id=${performerId}&client_secret=${seatgeek.client_secret}`
      console.log('FETCH URL: ', fetchURL)
      const response = await fetch(fetchURL);
      // `https://api.seatgeek.com/2/recommendations/?client_id=${seatgeek.client_id}&lat=${lat}&lon=${lng}&datetime_utc.gte=${today}&datetime_utc.lte=${threeMonths}&performers.id=${performerId}&client_secret=${seatgeek.client_secret}`
      // `https://api.seatgeek.com/2/events/?client_id=${seatgeek.client_id}&client_secret=${seatgeek.client_secret}&performers.slug=${artistString}&venue.city=${city}&datetime_utc.gte=${today}&datetime_utc.lte=${threeMonths}`
      // console.log('url fetching: ', `https://api.seatgeek.com/2/events/?client_id=${seatgeek.client_id}&client_secret=${seatgeek.client_secret}&performers.slug=${artistString}&venue.city=${city}&datetime_utc.gte=${today}&datetime_utc.lte=${threeMonths}`)
      const { recommendations } = await response.json();
      // console.log(recommendations);
      //making a separate object for each event returned back for an artist
      //~ put a filter so it is only 10 songs per artist
      for (let i = 0; i < recommendations.length; i++) {
        // console.log(i)
        el = recommendations[i]
        if (el.event && el.event.performers && el.event.performers.length > 0
          && eventsURLs.has(el.event.url) === false //~ Get URL and check if doesnt exist already in array (prevent duplicates)
        ) {
          eventsURLs.add(el.event.url)
          const performerOne = el.event.performers[0];
          const performerTwo = el.event.performers.length > 1 ? el.event.performers[1] : null;
          const event = {
            artist: performerOne && performerOne.name ? performerOne.name : "N/A",
            genre: performerTwo && performerTwo.genres && performerTwo.genres[0] && performerTwo.genres[0].name ? performerTwo.genres[0].name : "N/A",
            price: el.event.stats ? el.event.stats.lowest_price : "N/A",
            date: el.event.datetime_local,
            venue: el.event.venue ? el.event.venue.name : "N/A",
            eventUrl: el.event.url,
            imgUrl: performerOne && performerOne.image ? performerOne.image : "N/A",
          };
          // console.log(event)
          eventsArray.push(event);
        }
        // eventsArray.push(event);
      };
    }
    //attaching Array of objects to send as response to front end
    res.locals.artistEvents = eventsArray;
    console.log('artist eventsArray length: ', eventsArray.length)

    return next();
  } catch (err) {
    return next({
      log: `seatGeekController.getArtistEvents ERROR: trouble fetching seatgeek events by artists, ${err}`,
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