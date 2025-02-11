"use client";

import useParticipantStore from "@/store/use-participant";
import { DesktopHeader } from "./desktop-header";
import { MobileHeader } from "./mobile-header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Header = () => {
  const { asPath } = useRouter();
  const [backgroundColor, setBackgroundColor] = useState("transparent");

  useEffect(() => {
    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        if (currentScrollPos > 200) {
          setBackgroundColor("white"); // Change this to the color you prefer
        } else {
          setBackgroundColor("transparent");
        }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log(backgroundColor);
  }, [backgroundColor])

  if(asPath === '/')
  return (
    <div>
      <div
        className="max-[990px]:hidden shadow-lg fixed w-full z-[30] primary-transition "
        style={{ backgroundColor: backgroundColor, color: backgroundColor === 'transparent' ? 'white' : 'black' }}
      >
        <DesktopHeader />
      </div>
      <div
        className="min-[990px]:hidden fixed w-full shadow-md  z-[30]  primary-transition min-h-[80px] flex flex-col justify-center"
        style={{ backgroundColor: backgroundColor, color: backgroundColor === 'transparent' ? 'white' : 'black' }}
      >
        <MobileHeader />
      </div>
    </div>
  );
  else 
  return (
    <div>
      <div
        className="max-[990px]:hidden shadow-lg fixed w-full z-[30] primary-transition"
        style={{ backgroundColor: 'white' }}
      >
        <DesktopHeader />
      </div>
      <div
        className="min-[990px]:hidden fixed w-full shadow-md  z-[30]  primary-transition min-h-[80px] flex flex-col justify-center"
        style={{ backgroundColor: 'white' }}
      >
        <MobileHeader />
      </div>
    </div>
  );
};

export default Header;
