const { seatgeek, google } = require('../models/secrets.js');

const seatGeekController = {};

//get request to SeatGeek based on user artist preferences
seatGeekController.getArtistEvents = async (req, res, next) => {
  console.log('entering: seatGeekController.getArtistEvents')
  try {
    const eventsArray = [];
    const eventsURLs = new Set();
    const priorityEvents = [];
    const recommendedEvents = [];
    const artists = res.locals.userInfo.artists;
    const city = res.locals.userInfo.location.city;
    const state = res.locals.userInfo.location.state

    // adding all users artists in slug format into array
    const usersArtists = [];
    artists.forEach( (a) => {
      usersArtists.push(a.toLowerCase().replaceAll(' ', '-'))
    })
    console.log('users all artists: ', usersArtists)



    //~ generating constants for todays date and date three months from now in API format
    const date = new Date();
    const today = date.toJSON().slice(0, 10);
    const threeMonths = new Date(date.setMonth(date.getMonth() + 3))
      .toJSON()
      .slice(0, 10);

    //~ get location of user in longitude and latitude
    const noSpacesCity = city.replace(/\s/g, '');
    const googleURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${noSpacesCity},${state}&key=${google.api_key}`
    const locationResponse = await fetch(googleURL)
    const locationReturn = await locationResponse.json()
    const { lng, lat } = locationReturn.results[0].geometry.location

    //~ iterating through each artist in array and fetching Event data
    for (let i = 0; i < artists.length; i++) {

      // converting artist name to slug format
      const artistString = artists[i].toLowerCase().replaceAll(' ', '-');

      //~ get performers id
      const performerResponse = await fetch(`https://api.seatgeek.com/2/performers?slug=${artistString}&client_id=${seatgeek.client_id}`)
      const performerData = await performerResponse.json()
      
      // continueing if artist name doesnt exist in seatgeek api
      if (performerData.performers.length === 0) continue;
      const performerId = performerData.performers[0].id

      const fetchURL = `https://api.seatgeek.com/2/recommendations/?client_id=${seatgeek.client_id}&lat=${lat}&lon=${lng}&datetime_utc.gte=${today}&datetime_utc.lte=${threeMonths}&performers.id=${performerId}&client_secret=${seatgeek.client_secret}`
      console.log('FETCH URL: ', fetchURL)
      const response = await fetch(fetchURL);
      const { recommendations } = await response.json();

      //~ put a filter so it is only 10 songs per artist
      for (let i = 0; i < recommendations.length; i++) {

        el = recommendations[i]
        if (el.event && el.event.performers && el.event.performers.length > 0
          && eventsURLs.has(el.event.url) === false // Get URL and check if doesnt exist already in array (prevent duplicates)
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
          //~ if artist of event matches artistString, add to priority event list
          const eventArtist = el.event.performers[0].name.toLowerCase().replaceAll(' ', '-');
          console.log('EVENT ARTIST: ', eventArtist)
          // if (usersArtists.includes(eventArtist))
          //eventArtist == artistString
          if (usersArtists.includes(eventArtist)) priorityEvents.push(event)
          else recommendedEvents.push(event)
          eventsArray.push(event);
        }
      };
    }
    console.log('PRIORITY EVENT: ', priorityEvents)
    // console.log('RECOMMENDED EVENT: ',recommendedEvents)
    console.log(priorityEvents.length, recommendedEvents.length)


    //attaching Array of objects to send as response to front end
    priorityEvents.sort(function(a, b) {
      if (a.artist < b.artist) { 
        return -1;
      }
      if (a.artist > b.artist) {
        return 1;
      }
      return 0;
    });
    
    console.log('PRIORITY EVENT: ', priorityEvents)

    res.locals.artistEvents = priorityEvents.concat(recommendedEvents);
    // console.log('artist eventsArray length: ', eventsArray.length)

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