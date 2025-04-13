import Places from './Places.jsx';
import { useState, useEffect } from 'react';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/places');
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
navigator.geolocation.getCurrentPosition((position)=>{
  const sortedPlaces=sortPlacesByDistance(
    data.places,
    position.coords.latitude,
    position.coords.longitude
  )

  setAvailablePlaces(sortedPlaces);
  setIsLoading(false);
})
      } catch (error) {
        setError({message: error.message|| 'Something went wrong! Please try again later.'});
        setIsLoading(false);
      } 
       
      
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occurred" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
      isLoading={isLoading}
      onLoadingText="Loading places..."
    />
  );
}
