import React from 'react';
import { API } from '../config';

const ShowImage = ({ item, url }) => {
  // Check if item has external image URL (from Fake Store API)
  const imageSource = item.imageUrl 
    ? item.imageUrl 
    : `${API}/${url}/photo/${item._id}`;

  return (
    <div className='product-img' style={{height: '250px'}}>
      <img
        src={imageSource}
        alt={item.name}
        className='mb-3'
        style={{ 
          objectFit: 'contain', 
          height: '100%', 
          width: '100%', 
          display: 'flex', 
          marginLeft: 'auto', 
          marginRight: 'auto' 
        }}
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          e.target.src = 'https://via.placeholder.com/250x250?text=No+Image';
        }}
      />
    </div>
  );
};

export default ShowImage;
