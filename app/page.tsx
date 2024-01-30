"use client";
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import BottomLeftComponent from "./components/BottomLeftComponent";
import BottomMiddleComponent from "./components/BottomMiddleComponent";
import BottomRightComponent from "./components/BottomRightComponent";
import UpperLeftComponent from "./components/UpperLeftComponent";
import UpperRightComponent from "./components/UpperRightComponent";

const Home: NextPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  // attest sending roy
  // create story
  // embed results
  // upload to db
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is a common breakpoint for mobile
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={isMobile ? "mobile-layout-class" : "desktop-layout-class"}
      >
        <img
          src="/RoyTitleScreen.png"
          className="w-full max-w-md mx-auto"
          alt="Roy Title Screen"
        />

        <UpperLeftComponent />
        <UpperRightComponent />
        <BottomLeftComponent />
        <BottomMiddleComponent />
        <BottomRightComponent />
      </div>
    </>
  );
};

export default Home;
