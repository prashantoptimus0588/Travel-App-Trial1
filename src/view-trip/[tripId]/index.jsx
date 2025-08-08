import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom'
import InfoSection from './components/InfoSection';
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';
import Footer from './components/Footer';


const viewtrip = () => {
    
    const {tripId}=useParams();
    const [trip,setTrip]=useState([]);
    
    useEffect(() => {
        tripId && GetTripData();
        
    }, [tripId])
    


    /*
    Used to get trip information from Firebase
    */ 
    const GetTripData=async()=>{
        const docRef=doc(db,'AiGeneratedTrips',tripId);
        const docSnap=await getDoc(docRef);

        if(docSnap.exists()){
            console.log(("Document",docSnap.data()));
            setTrip(docSnap.data());
        }
        else{
            console.log("No Such Document");
            toast('No trip Found!')
        }
    }
    
     
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Information Section  */}
        <InfoSection trip={trip}/>
      {/* Recommended Hotels */}
        <Hotels trip={trip}/>
      {/* Daily Plan */}
        <PlacesToVisit trip={trip}/>
      {/* Footer */}
        <Footer/>

    </div>
  )
}

export default viewtrip
