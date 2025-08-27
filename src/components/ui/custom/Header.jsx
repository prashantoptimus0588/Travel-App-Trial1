import React, { useState,useEffect } from "react";
import { Button } from "../Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useNavigation } from "react-router-dom";
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
  


  useEffect(() => {
    console.log(user);
    console.log("User picture URL:", user?.picture);

  }, []);

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
    <div className="p-3 shadow-sm flex justify-between items-center">
      <img src="/logo.svg" alt="TravelGenie logo" className="h-12 w-auto" />
      <div>{user ?
          <div className="flex items-center gap-5">
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full">+Create Trip</Button>
            </a>
            
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full">My Trips</Button>
            </a>

  
            <Popover>
              <PopoverTrigger><img src={user?.picture} className="h-[35px] w-[35px] rounded-full"/></PopoverTrigger>
              <PopoverContent>
                <h2 onClick={(login)=>{
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>
                  LogOut
                </h2>
              </PopoverContent>
              
            </Popover>

          </div> 
            : <Button onClick={()=>setOpenDialog(true)} >Sign In</Button>}

          <div>
            <Dialog open={openDialog} >
            <DialogContent>
              <DialogHeader>
                
                <DialogDescription>
                  <img src="/logo.svg" alt="" 
                    className='max-w-50'/>
                  <h2 className='font-bold text-lg mt-7'>Sign In with Google</h2>
                  <p>Sign in to the app with Google Authentication securely</p>
                  <Button 
                    onClick={login}
                    className='w-full mt-5 flex gap-4 items-center justify-center'>
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
  );
};

export default Header;
