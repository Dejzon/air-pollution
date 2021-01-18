import React from 'react';


const LocationList = props => {
  return (
    <section className="Location-list">
      <h2>Loaded Locations</h2>
      <ul>
        {props.location.map(locationItem => (
          <li key={locationItem.id} onClick={props.onRemoveItem.bind(this, locationItem.id)}>
            <div>{locationItem.lon}</div>
            <div>{locationItem.lat}x</div>
            <div>{locationItem.place}</div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LocationList;
