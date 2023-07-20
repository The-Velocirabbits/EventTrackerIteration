import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export const List = ({ arr, type }) => {
  if (!Array.isArray(arr)) return <div>idk bruther</div>
  return (
    <div className="showBox">
      <h3>Upcoming Shows</h3>
      <div className='displayBoxes'>
        <div className="artistShows">
          <h2>Shows Filtered By {type}</h2>
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