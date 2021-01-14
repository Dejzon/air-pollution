import React, { useState, useEffect, useContext } from "react"
import { LocationContext } from '../context/LocationContext';
import { Table } from "react-bootstrap"
import axios from "axios"

function CurrentAir() {
  const [airData, setAirData] = useState(null)

  const { markers, finalLat, finalLng } = useContext(LocationContext);
  let marker = {lng: 50, lat: 55};
  console.log(markers.length)
  console.log(marker.lng)
 

let longitudeList =  markers.map(marker => {
  return (
marker.lng
  );
})

let latitudeList =  markers.map(marker => {
  return (
marker.lat
  );
})

  let longitude = (markers.length !== 0) ? longitudeList[longitudeList.length - 1] : marker.lng;
  let latitude = (markers.length !== 0) ? latitudeList[latitudeList.length - 1] : marker.lat;
  

  useEffect(() => {
    async function getData() {
     
      const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${longitude}&lon=${latitude}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`

    

      console.log(url);
      try {
        const response = await axios.get(url)
        setAirData(response.data)
      } catch (err) {
       
      }
     
    }
    getData()
  }, [longitude, latitude])

  

  if (!airData) {
    return <div>Loading indicator</div>
  }

  console.log(airData)
  return (
    <div>

<Table responsive>
  <thead>
    <tr>
      <th>CO</th>
      <th>NO</th>
      <th>NO<span>2</span></th>
      <th>O<span>3</span></th>
      <th>SO<span>2</span></th>
      <th>PM<span>2_5</span></th>
      <th>PM<span>10</span></th>
      <th>NH<span>3</span></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{airData.list[0].components.co}</td>
      <td>{airData.list[0].components.no}</td>
      <td>{airData.list[0].components.no2}</td>
      <td>{airData.list[0].components.o3}</td>
      <td>{airData.list[0].components.so2}</td>
      <td>{airData.list[0].components.pm2_5}</td>
      <td>{airData.list[0].components.pm10}</td>
      <td>{airData.list[0].components.nh3}</td>
     
    </tr>
   
  </tbody>
</Table>
 
      <div>{airData.coord.lon}</div>
      <div>{marker.lon}</div>
      <div>{longitude}</div>
      <div>{airData.list[0].components.co}</div>

    </div>

    
  )
}




export default CurrentAir