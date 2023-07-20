import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export const List = ({ arr, type, location }) => {
  if (!Array.isArray(arr)) return <div>idk bruther</div>
  return (
    <div className="showBox">
      {type === 'Artist' ? <h2>Upcoming Shows ({location.city}, {location.state})</h2> : <div></div>}
      <div className='displayBoxes'>
        <div className="artistShows">
          <h3>Shows Filtered By {type}</h3>
          <div className='overflowBox'>
            {arr ? arr.map((el) => (
              <div key={uuidv4()} className="card">
                <img src={el.imgUrl} />
                <div>Artist: {el.artist}</div>
                <div>Genre: {el.genre}</div>
                <div>Date: {el.date}</div>
                <div>Location: {el.venue}</div>
                <div>Price: ${el.price}</div>
              </div>
            )) : `No ${type}`}
          </div>
        </div>
      </div>
    </div>
  );
};