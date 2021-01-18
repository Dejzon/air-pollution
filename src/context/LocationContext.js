import React, { createContext, useState, useEffect, useCallback } from 'react';

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow

} from "@react-google-maps/api";



import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";
import { Container, Button } from "react-bootstrap"



import LocationList from '../components/LocationList';
import ListSearch from '../components/ListSearch';


import "@reach/combobox/styles.css";

export const LocationContext = createContext();

const libraries = ["places"];
const mapContainerStyle = {
  height: "50vh",
  width: "100%",
};
const options = {
  //   styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};




const LocationContextProvider = (props) => {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);


  const [selected, setSelected] = React.useState(null);



  const onMapClick = React.useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);

  }, []);



  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;

    console.log(map.formatted_address)

  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });

    mapRef.current.setZoom(14);

    setMarkers((current) => [
      ...current,
      {
        lat: lat,
        lng: lng,
        time: new Date(),
      },
    ]);

  }, []);



  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";


  let longitudeList = markers.map(marker => {
    return (
      marker.lng
    );
  })

  let latitudeList = markers.map(marker => {
    return (
      marker.lat
    );
  })

  


  let longitude = longitudeList[longitudeList.length - 1];
  let latitude = latitudeList[latitudeList.length - 1];


  return (
    <LocationContext.Provider value={{ markers }}>
      <Container>
        {props.children}

        {/* google map */}
        <div className="container">
          { }
          <h1>
            {/* Bears{" "}
            <span role="img" aria-label="tent">
              ⛺️
        </span> */}


koordinate iz locationcontexta {longitude} {latitude}

          </h1>



          <AddLocation longitude={longitude} latitude={latitude} />
          <Locate panTo={panTo} />

          <Search panTo={panTo} />

          <GoogleMap
            id="map"
            mapContainerStyle={mapContainerStyle}
            zoom={8}
            center={center}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
            render={({


            })}

          >

            {markers.map((marker) => (
              <Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                  setSelected(marker);
                }}
                icon={{
                  url: `/bear.svg`,
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ))}

            {selected ? (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => {
                  setSelected(null);
                }}
              >
                <div>
                  {selected.lat}
                  {selected.lng}
                  <h2>
                    <span role="img" aria-label="bear">
                      🐻
                </span>{" "}
                    <div><span>AQI: </span>
                      {/* {airData.list[0].main.aqi} */}
                    </div>
                  </h2>
                  <p>Spotted {formatRelative(selected.time, new Date())}</p>
                </div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </div>

      </Container>
    </LocationContext.Provider>
  )
}


function Locate({ panTo }) {

  return (
    <Button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: (position.coords.latitude),
              lng: (position.coords.longitude),
            });
          },

          () => null

        );

      }}
    >
      compass
    </Button>

  );
}



function Search({ panTo }) {

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 1000 * 1000,
    },
  });



  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      
      
   

      panTo({ lat, lng });



    } catch (error) {
      console.log("😱 Error: ", error);
    }

  };

  return (
    <div className="search">

      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}


const AddLocation = ({ longitude, latitude }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [userLocation, setUserLocation] = useState([]);
  const [placeName, setPlaceName] = useState(null)


  const submitHandler = event => {
    event.preventDefault();
    addLocationHandler({ lon: longitude, lat: latitude, place: placeName });

  };

  useEffect(() => {
    console.log('RENDER Location', userLocation);
  }, [userLocation]);

  const filteredLocationHandler = useCallback(filteredLocation => {
    
    setUserLocation(filteredLocation);
  }, []);



  async function getplaceName(lat, lng) {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      console.log(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
      console.log(data);
      if (data.results.length > 0) {
        console.log("ima nesto!!!")
        setPlaceName(data.results[0].address_components[2].long_name)
      }
      else {
        console.log("NEMA NISTA!!!!")
        setPlaceName("Unknown Location")
      }

    } catch (error) {
      console.log(error);
    }
  }
  console.log(placeName)





  const addLocationHandler = (location) => {
    fetch('https://auth-hooks-dev-3ac29-default-rtdb.firebaseio.com/locations.json', {
      method: 'POST',
      body: JSON.stringify(location),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        
        return response.json();

      })
      .then(responseData => {
        console.log(responseData)
        getplaceName(latitude, longitude)
        setUserLocation(prevLocation => [
          ...prevLocation,
          { id: responseData.name, ...location }
        ]);
      });
  };

  const removeLocationHandler = locationId => {
    setIsLoading(true);
    fetch(
      `https://auth-hooks-dev-3ac29-default-rtdb.firebaseio.com/locations/${locationId}.json`,
      {
        method: 'DELETE'
      }
    ).then(response => {
      setIsLoading(false);
      setUserLocation(prevLocation =>
        prevLocation.filter(location => location.id !== locationId)
      );
    }).catch(error => {
      setError('Something went wrong!');
      setIsLoading(false);
    });
  };

  return (
    <div className="App">

      <section>
        <ListSearch onLoadLocations={filteredLocationHandler} />
        <LocationList
          location={userLocation}
         
          onRemoveItem={removeLocationHandler}
        />
        <div className="Location-form__actions">
          <form onSubmit={submitHandler}>
            <button type="submit" >Add Location</button>
          </form>
        </div>
      </section>
    </div>
  );
};




export default LocationContextProvider;