import React, { useState,useEffect } from "react";
import { Button } from "../Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom"; // Removed useNavigation as it's not used
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from "axios";


const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog,setOpenDialog]=useState(false);
  
  // Removed useNavigation as it was imported but not used.
  // const navigate = useNavigate(); // useNavigate is already imported and used in CreateTrip, but not here.

  useEffect(() => {
    console.log(user);
    console.log("User picture URL:", user?.picture);

  }, [user]); // Added user to dependency array for useEffect

  const login=useGoogleLogin({
    onSuccess:(codeResp)=>GetUserProfile(codeResp),
    onError:(error)=>console.log(error),
    
  })
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
      window.location.reload();
    })
    
  }

  return (
    <div className="p-4 shadow-lg flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-b-xl">
      <img src="/logo.svg" alt="TravelGenie logo" className="h-10 w-auto md:h-12" />
      <div className="flex items-center gap-4 md:gap-6"> {/* Responsive gap */}
        {user ?
          <> {/* Use Fragment for multiple elements */}
            <a href="/create-trip">
              <Button 
                variant="outline" 
                className="rounded-full bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 text-sm md:text-base px-3 py-1 md:px-4 md:py-2 shadow-md hover:shadow-lg"
              >
                +Create Trip
              </Button>
            </a>
            
            <a href="/my-trips">
              <Button 
                variant="outline" 
                className="rounded-full bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 text-sm md:text-base px-3 py-1 md:px-4 md:py-2 shadow-md hover:shadow-lg"
              >
                My Trips
              </Button>
            </a>

            <Popover>
              <PopoverTrigger>
                <img 
                  src={user?.picture} 
                  className="h-9 w-9 rounded-full object-cover cursor-pointer border-2 border-white shadow-md hover:scale-105 transition-transform duration-200"
                  alt="User Profile"
                />
              </PopoverTrigger>
              <PopoverContent className="bg-white p-3 rounded-lg shadow-xl text-gray-800">
                <h2 
                  onClick={()=>{
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-150 text-center font-medium"
                >
                  Log Out
                </h2>
              </PopoverContent>
            </Popover>
          </> 
          : 
          <Button 
            onClick={()=>setOpenDialog(true)} 
            className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            Sign In
          </Button>
        }

        {/* Dialog for Sign In */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}> {/* Added onOpenChange for better control */}
          <DialogContent className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
            <DialogHeader>
              <DialogDescription>
                <img src="/logo.svg" alt="TravelGenie Logo" 
                  className='max-w-40 mx-auto mb-6'/> {/* Adjusted max-w and added mb */}
                <h2 className='font-bold text-2xl text-gray-800 mt-7 text-center'>Sign In with Google</h2>
                <p className='text-gray-600 mt-2 text-center'>Sign in to the app with Google Authentication securely</p>
                <Button 
                  onClick={login}
                  className='w-full mt-5 flex gap-4 items-center justify-center bg-blue-600 text-white rounded-full py-3 hover:bg-blue-700 transition-colors shadow-md'>
                  <FcGoogle className='h-7 w-7'/>
                  Sign In with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Header;
