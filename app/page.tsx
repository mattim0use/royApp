"use client";
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import BottomLeftComponent from "./components/BottomLeftComponent";
import BottomMiddleComponent from "./components/BottomMiddleComponent";
import BottomRightComponent from "./components/BottomRightComponent";
import UpperLeftComponent from "./components/UpperLeftComponent";
import UpperRightComponent from "./components/UpperRightComponent";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BotScreen } from "./components/AppComponent";
import Image from "next/image";
import houseBackground from "../public/RoyLogo.png";
import { newRoy, Roy } from "@/app/hooks/useRoy";
import { useAccount } from "wagmi";
import { useSigner } from "./utils/wagmi-utils";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useBotStore } from "./store/bot";
import { useGlobalState } from "./store/store";
import { ChatMessage } from "./store/session";
import { RoyAttributes } from "./hooks/useRoy";
import toast from "react-hot-toast";

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


                <div className="fixed -top-24 left-1/4 -ml-4 mb-6 flex flex-col text-black items-center flex-grow pt-10">

                    <div
                        className="absolute top-80 left-40 backdrop-blur-lg rounded-full"
                    >
                        <div className="px-5">

                            <div
                                className="relative overflow-auto -left-8  w-[500px] h-[450px] bg-gradient-to-b from-transparent to-gray-900 opacity-80 backdrop-blur-lg text-white p-24 rounded-badge">
                                <Image
                                    className="fixed"
                                    fill
                                    src="/RoyTitleScreen.png"
                                    alt="Roy Title Screen"
                                />




                            </div>





                        </div>


                    </div>

                    <Image
                        className="fixed left-[24%] top-0"
                        width={1000}
                        height={1000}
                        src="/royInterface.png"
                        alt="Roy Interface"
                    />

                    <div className="flex-grow w-full mt-16 px-8 py-12">
                        {/* Other content */}
                    </div>

                    {/* Play Button */}


                </div>
                <UpperLeftComponent />
                <UpperRightComponent />
                <BottomLeftComponent />
                <BottomRightComponent />
            </div>
        </>
    );
};

export default Home;
