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
    {/* Logo */}
    <a href="/" className="flex items-center gap-2">
      <img src="/logo.svg" alt="TravelGenie logo" className="h-8 w-auto md:h-10" />
    </a>

    {/* Actions */}
    <div className="flex items-center gap-3 md:gap-6">
      {user ? (
        <>
          {/* Create Trip */}
          <a href="/create-trip">
            <Button className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 shadow-lg flex items-center gap-2">
              <span className="text-lg">➕</span>
              <span className="hidden sm:inline">Create Trip</span>
            </Button>
          </a>

          {/* My Trips */}
          <a href="/my-trips">
            <Button className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 shadow-lg flex items-center gap-2">
              📂 <span className="hidden sm:inline">My Trips</span>
            </Button>
          </a>

          {/* User Profile */}
          <Popover>
            <PopoverTrigger asChild>
              <img
                src={user?.picture}
                alt="User Profile"
                className="h-10 w-10 md:h-11 md:w-11 rounded-full object-cover border-2 border-white shadow-md 
                          hover:ring-2 hover:ring-white/70 hover:scale-105 transition-all duration-200 cursor-pointer"
              />
            </PopoverTrigger>

            <PopoverContent className="bg-white p-4 rounded-xl shadow-2xl text-gray-800 w-64">
              <div className="flex items-center gap-3 border-b pb-3 mb-3">
                <img
                  src={user?.picture}
                  className="h-12 w-12 rounded-full object-cover"
                  alt="User Profile"
                />
                <div>
                  <h3 className="font-semibold text-sm">{user?.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full text-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Log Out
              </button>
            </PopoverContent>
          </Popover>

        </>
      ) : (
        
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-2xl shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Sign In
        </Button>

      )}

      {/* Sign-In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="TravelGenie Logo" className="max-w-40 mx-auto mb-6" />
              <h2 className="font-bold text-2xl text-gray-800 mt-7 text-center">Sign In with Google</h2>
              <p className="text-gray-600 mt-2 text-center">
                Sign in to the app with Google Authentication securely
              </p>
              <Button
                onClick={login}
                className="w-full mt-5 flex gap-4 items-center justify-center bg-blue-600 text-white rounded-full py-3 hover:bg-blue-700 transition-colors shadow-md"
              >
                <FcGoogle className="h-7 w-7" />
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
