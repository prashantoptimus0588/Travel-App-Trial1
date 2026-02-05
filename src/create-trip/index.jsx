import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import Input from '../components/ui/custom/Input';
import { SelectBudgetOptions, SelectTravelersList } from '@/constants/options';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { generateTravelPlan } from '@/service/api-service'; // ✅ UNCOMMENTED
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc,setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { CgSearchLoading } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';



function CreateTrip() {
  const[place,setPlace]=useState();
  
  const[formData,setFormData]=useState([]);

  const [openDialog,setOpenDialog]=useState(false);

  const [loading,setLoading]=useState(false);

  const navigate=useNavigate();
  
  const handleInputChange=(name,value)=>{
  
    if(name=='NumberOfDays' && value>5){
      console.log("Please select at most 5 days");
    }
    setFormData({
      ...formData,[name]:value
    })
  }
  useEffect(()=>{
    console.log(formData);
  },[formData])

  const login=useGoogleLogin({
    onSuccess:(codeResp)=>GetUserProfile(codeResp),
    onError:(error)=>console.log(error),
    
  })


  // ✅ IMPROVED: Optimized OnGenerateTrip function with better error handling
  const OnGenerateTrip = async() => {
    const { NumberOfDays, location, budget, travelers } = formData || {}; 

    const user = localStorage.getItem('user');

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (!location || !budget || !travelers || NumberOfDays == null) {
      toast.error("Please fill all details");
      return;
    }

    if (NumberOfDays > 5) {
      toast.error("Enter less than or equal to 5 days");
      return;
    }

    toast.success("Please wait while we are generating your trip!✈️");
    setLoading(true);

    // ✅ OPTIMIZED PROMPT - Shorter, clearer, saves tokens
    const FINAL_PROMPT = `Create a ${NumberOfDays}-day travel plan for ${location?.label} for ${travelers} with ${budget} budget.

Return ONLY valid JSON with this exact structure (no markdown, no extra text):

{
  "hotels": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "priceInINR": "string",
      "hotelImageUrl": "string",
      "bookingLink": "string",
      "geoCoordinates": "string",
      "rating": "string",
      "description": "string"
    }
  ],
  "itinerary": {
    "day1": [
      {
        "placeName": "string",
        "placeDetails": "string",
        "placeImageUrl": "string",
        "geoCoordinates": "string",
        "ticketPricing": "string",
        "timeToTravel": "string",
        "bestTimeToVisit": "string",
        "duration": "string"
      }
    ]
  },
  "location": "${location?.label}",
  "budget": "${budget}",
  "travelers": "${travelers}",
  "duration": "${NumberOfDays} days"
}

Include 4+ hotels and ${NumberOfDays} days in itinerary (day1, day2, etc.). Use camelCase for all keys.`;

    try {
      const aiResponse = await generateTravelPlan(FINAL_PROMPT);
      console.log("✅ AI Response received:", aiResponse);
      setLoading(false);
      await SaveAiTrip(aiResponse);
    } catch (error) {
      setLoading(false);
      console.error("❌ Trip generation error:", error);
      
      // Better error handling
      if (error.message?.includes('Too many requests')) {
        toast.error("API rate limit reached. Please wait 1 minute and try again.");
      } else if (error.message?.includes('API key')) {
        toast.error("Invalid API key. Please check your .env file.");
      } else {
        toast.error(error.message || "Failed to generate trip. Please try again.");
      }
    }
  };

  // ✅ IMPROVED: Better SaveAiTrip function with validation
  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();
      
      // Parse and validate JSON
      let parsedData;
      try {
        parsedData = JSON.parse(TripData);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.log('Raw data:', TripData);
        
        toast.error('Invalid response format. Please try again.');
        setLoading(false);
        return;
      }
      
      // Validate required fields
      if (!parsedData.hotels || !parsedData.itinerary) {
        toast.error('Incomplete trip data received. Please try again.');
        setLoading(false);
        return;
      }
      
      console.log("💾 Saving to Firebase...", parsedData);
      
      // Save to Firestore
      await setDoc(doc(db, "AiGeneratedTrips", docId), {
        userSelection: formData,
        tripData: parsedData,
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString()
      });
      
      setLoading(false);
      toast.success('Trip saved successfully! 🎉');
      navigate('/view-trip/' + docId);
      
    } catch (error) {
      console.error('❌ Save Error:', error);
      setLoading(false);
      
      if (error.code === 'permission-denied') {
        toast.error('Database permission denied. Check Firebase rules.');
      } else {
        toast.error('Failed to save trip. Please try again.');
      }
    }
  };


  const GetUserProfile=async (tokenInfo)=>{
    await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,{
      headers:{
        Authorization:`Bearer ${tokenInfo?.access_token}`,
        Accept:'Application/json'
      }
    }).then((resp)=>{
      console.log(resp);
      localStorage.setItem('user',JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
    
  }

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen'>
      
      <div className='bg-white p-8 rounded-2xl shadow-xl'>
        <h2 className='font-extrabold text-4xl text-gray-800 tracking-wide'>
          Plan your adventure 🌍🌴
        </h2>

        <p className='mt-4 text-gray-600 text-lg'>Just provide some basic information, and our AI trip planner will generate a customized itinerary based on your preferences.
        </p>

        <div className='mt-12 flex flex-col gap-10'>
            <div>
              <h2 className='text-xl my-3 font-semibold text-gray-700'>What's your Destination?</h2>
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                selectProps={{
                  placeholder:"Search Location",
                  value:place,
                  onChange:(e)=>{setPlace(e);handleInputChange('location',e)},
                  className: 'w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500',
                }}
              />
            </div>

            <div>
              <h2 className='text-xl my-3 font-semibold text-gray-700'>How many days are you planning your trip?</h2>
                <Input 
                  className='w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300'
                  placeholder={'Ex. 3, 4, 5'} 
                  type="number"
                  onChange={(e)=>handleInputChange('NumberOfDays',Number(e))}
                />
            </div>

            <div>
              <h2 className='text-xl my-3 font-semibold text-gray-700'>What is your budget?</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-5'>
                {SelectBudgetOptions.map((item,index)=>(
                    <div key={index} 
                      className={`p-6 border-2 border-transparent rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${formData?.budget==item.title?'border-purple-600 bg-purple-50 shadow-md':'bg-gray-100'}`}
                      onClick={()=>handleInputChange('budget',item.title)}>
                      <h2 className='text-4xl'>{item.icon}</h2>
                      <h2 className='font-bold text-lg mt-2 text-gray-800'>{item.title}</h2>
                      <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                    </div>
                ))}
              </div>

              <h2 className='text-xl my-3 font-semibold text-gray-700 mt-10'>Who do you plan on travelling with on your next adventure?</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-5'>
                {SelectTravelersList.map((item,index)=>(
                    <div key={index} 
                      className={`p-6 border-2 border-transparent rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${formData?.travelers==item.people?'border-indigo-600 bg-indigo-50 shadow-md':'bg-gray-100'}`}
                      onClick={()=>handleInputChange('travelers',item.people)}>
                      <h2 className='text-4xl'>{item.icon}</h2>
                      <h2 className='font-bold text-lg mt-2 text-gray-800'>{item.title}</h2>
                      <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                    </div>
                ))}
              </div>
            </div>
        </div>
        <div className='my-10 justify-end flex'>
          <Button
            className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
            disabled={loading}
            onClick={OnGenerateTrip}>
              {
                loading ?
                <CgSearchLoading className='h-7 w-7 animate-spin'/> : 'Generate Trip'
              }
          </Button>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="bg-white rounded-lg shadow-xl p-6">
              <DialogHeader>
                <DialogDescription>
                  <img src="/logo.svg" alt="" 
                    className='max-w-50 mx-auto'/>
                  <h2 className='font-bold text-2xl text-gray-800 mt-7 text-center'>Sign In with Google</h2>
                  <p className='text-gray-600 mt-2 text-center'>Sign in to the app with Google Authentication securely</p>
                  <Button 
                    onClick={login}
                    className='w-full mt-5 flex gap-4 items-center justify-center bg-blue-500 text-white rounded-full py-3 hover:bg-blue-600 transition-colors'>
                    <FcGoogle className='h-7 w-7'/>
                    Sign In with Google
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}


export default CreateTrip;
