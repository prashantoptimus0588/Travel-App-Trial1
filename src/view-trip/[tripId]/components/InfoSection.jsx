import React,{useEffect, useState} from 'react'
import { FaShareAlt } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { GetPlaceDetails } from '@/service/GlobalApi'
import { PHOTO_REF_URL } from '@/service/GlobalApi'

const InfoSection = ({trip}) => {

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
    <div>
      <img 
        src={photoUrl} 
        className='h-[340px] w-full object-cover rounded-xl'
        alt="placeholder" 
       />

      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.label}
            {/* added a mt-2 in below div */}
            <div className='flex gap-5 mt-2'>
              <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🗓️{trip?.userSelection?.NumberOfDays} Day </h2>
              <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💲{trip?.userSelection?.budget} Budget </h2>
              <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🧑‍🤝‍🧑{trip?.userSelection?.travelers} Travelers </h2>
            </div>
          </h2>
        </div>

        <Button><FaShareAlt/></Button>

      </div>

    </div>
  )
}

export default InfoSection
