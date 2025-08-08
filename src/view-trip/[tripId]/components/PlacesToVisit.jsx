import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';

const PlacesToVisit = ({ trip }) => {

  const [photoUrls, setPhotoUrls] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      const allPlaces = trip?.tripData?.itinerary || {};
      const newPhotoUrls = {};

      for (const [day, items] of Object.entries(allPlaces)) {
        for (const place of items) {
          try {
            const data = { textQuery: place.placeName };
            const res = await GetPlaceDetails(data);
            const photoName = res.data.places?.[0]?.photos?.[0]?.name;
            const photoUrl = PHOTO_REF_URL.replace('{NAME}',photoName)
            newPhotoUrls[place.placeName] = photoUrl;
          } catch (error) {
            console.error('Error fetching photo for', place.placeName, error);
          }
        }
      }

      setPhotoUrls(newPhotoUrls);
    };

    if (trip) fetchPhotos();
  }, [trip]);

  return (
    <div>
      <h2 className='font-bold text-2xl mb-4'>Places to Visit</h2>

      <div>
        {Object.entries(trip?.tripData?.itinerary || {})
          .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
          .map(([day, items], index) => (
            <div key={index} className='mb-6'>
              <h3 className='text-xl font-bold text-blue-700 mb-3 capitalize'>{day}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((place, idx) => (
                  <Link
                    to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.placeName)}`}
                    target="_blank"
                    key={idx}
                  >
                    <div className='p-4 border rounded-lg shadow-sm'>
                      <img
                        src={photoUrls[place.placeName] || '/placeholder.jpeg'}
                        alt={place.placeName}
                        className='w-full h-48 object-cover rounded-md mb-3'
                      />
                      <h4 className='text-lg font-bold text-blue-600'>{place.placeName}</h4>
                      <p className='text-sm text-gray-600'>{place.placeDetails}</p>

                      <div className='text-xs text-gray-500 mt-2'>
                        <p>🕒 {place.duration}</p>
                        <p>🎯 {place.timeToTravel}</p>
                        <p>🎟️ {place.ticketPricing}</p>
                        <p>🌤️ Best time: {place.bestTimeToVisit}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
