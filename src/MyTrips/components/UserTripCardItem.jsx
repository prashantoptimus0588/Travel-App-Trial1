import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React ,{useEffect, useState} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

  
  



const UserTripCardItem = ({trip}) => {
  const[photoUrl,setPhotoUrl]=useState();

  useEffect(() => {
    
    trip&&GetPlacePhoto();

  }, [trip])

  const GetPlacePhoto=async()=>{
    const locationLabel = trip?.userSelection?.location?.label;
    const data={
      textQuery:locationLabel
    }
    
    const result=await GetPlaceDetails(data).then(resp=>{
      console.log(resp.data.places[0].photos[3].name)

      const PhotoURL=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name)

      setPhotoUrl(PhotoURL)
    })
  }


  return (
    <Link to={'/view-trip/'+trip?.id}>
      <div className='hover:scale-105 transition-all '>
        <img src={photoUrl?photoUrl:'/placeholder.jpeg'} className='object-cover rounded-xl h-[250px] w-full' />
        <div>
          <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
          <h2 className='text-sm text-gray-500'>{trip?.userSelection?.NumberOfDays} Day trip with {trip?.userSelection?.budget} budget</h2>
        </div>
      </div>
    </Link>
  )
}

export default UserTripCardItem
