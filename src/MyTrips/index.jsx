import React, { useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from '@/service/firebaseConfig';
import UserTripCardItem from './components/UserTripCardItem';

const MyTrips = () => {

  useEffect(()=>{
    GetUserTrips();
  },[])

  const navigate=useNavigate();
  const[userTrips,setUserTrips]=useState([]);
  
  // Used to get all user trips
  
  const GetUserTrips=async()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    if(!user){
      navigate('/');
      return;
    }

    const q = query(collection(db, "AiGeneratedTrips"), where("userEmail", "==", user?.email));
    
    const querySnapshot = await getDocs(q);
    setUserTrips([]);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTrips(prevVal=>[...prevVal,doc.data()])
    });

  }

  return (
    <div className='p-10 md:px-20 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>My Trips</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-10'>
        {userTrips?.length>0?userTrips.map((trip,index)=>(
          <UserTripCardItem  trip={trip}/>
        ))
        :[1,2,3,4,5,6].map((item,index)=>(
          <div key={index} className='h-250px w-full bg-slate-200 animate-pulse rounded-xl'>

          </div>
        ))
      }
      </div>

    </div>
  )
}

export default MyTrips
