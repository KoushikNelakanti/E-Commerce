import React from 'react';
import { API } from '../config';

const ShowImage = ({ item, url }) => {
  // Check if the item is from Fake Store API (has image property directly)
  if (item.image) {
    return (
      <div className='product-img' style={{ height: '250px' }}>
        <img
          src={item.image}
          alt={item.name || item.title}
          className='mb-3'
          style={{
            objectFit: 'contain',
            height: '100%',
            width: '100%',
            display: 'flex',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </div>
    );
  }

  // Fallback to local API image handling
  return (
    <div className='product-img' style={{ height: '250px' }}>
      <img
        src={`${API}/${url}/photo/${item._id}`}
        alt={item.name}
        className='mb-3'
        style={{
          objectFit: 'contain',
          height: '100%',
          width: '100%',
          display: 'flex',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
    </div>
  );
};

export default ShowImage;