import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'

const HotelCardItem = ({hotel}) => {

    const[photoUrl,setPhotoUrl]=useState();
    
      useEffect(() => {
        
        hotel&&GetPlacePhoto();
    
      }, [hotel])
      
      
      const GetPlacePhoto=async()=>{
        
        const data={
          textQuery:hotel?.hotelName
        }
        
        const result=await GetPlaceDetails(data).then(resp=>{
          console.log(resp.data.places[0].photos[3].name)
    
          const PhotoURL=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name)
    
          setPhotoUrl(PhotoURL)
        })
      }


  return (
    <div>
    <Link to={'https://www.google.com/maps/search/?api=1&query='+hotel?.hotelName+hotel?.hotelAddress} target="_blank">
        <div className="hover:scale-105 transition-all cursor-pointer">
        <img src={photoUrl} alt="placeholder" className="rounded-xl h-[200px] w-full"/>
        <div className="my-2 flex flex-col gap-2">
            <h2 className="font-medium">{hotel?.hotelName}</h2>
            <h2 className="text-xs text-gray-500">{hotel?.hotelAddress}</h2>
            <h2 className="text-sm">💰Rs.{hotel?.priceInINR}</h2>
            <h2 className="text-sm">⭐ {hotel?.rating}</h2>
        </div>
        </div>
    </Link>
    </div>
  )
}

export default HotelCardItem
