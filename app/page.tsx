"use client";
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import BottomLeftComponent from "./components/BottomLeftComponent";
import BottomMiddleComponent from "./components/BottomMiddleComponent";
import BottomRightComponent from "./components/BottomRightComponent";
import UpperLeftComponent from "./components/UpperLeftComponent";
import UpperRightComponent from "./components/UpperRightComponent";
import Image from "next/image";
import { useGlobalState } from "@/app/store/store";
import { useAccount } from "wagmi";
import { RoyAttributes, Roy } from "@/app/hooks/useRoy";
import { BotScreen } from "./components/AppComponent";
import { SideBar } from "./components/layout/sidebar";




const Home: NextPage = () => {
    const account = useAccount()
    const address: `0x${string}` = account.address ? account.address : "0x000";
    const [royIndex, setIndex] = useState(0)
    const [decade, setDecade] = useState(0)

    const [channelIndex, setNewIndex] = useState(0)
    const state = useGlobalState(state => state);
    const [isMobile, setIsMobile] = useState(false);
    const royStates = ["", "", "", "", ""]



    const royChannels = () => {
        switch (channelIndex) {
            case 4:
                return <UpperRightComponent />
            case 3:
                return <SideBar />
            case 2:
                return <BottomMiddleComponent />
            case 1:
                return <BotScreen />
            case 0: return <Image
                className="fixed"
                fill
                src="/RoyTitleScreen.png"
                alt="Roy Title Screen"
            />
        }
    }

    const roys = state.roys;
    const royPie = 100 / state.roys.length;
    const decadePie = roys[royIndex].roy?.length;
    let roy = state.roy;
    console.log(roys);
    // Signer must be an ethers-like signer.
    //
    const setRoy = useGlobalState(state => state.setRoy)
    //filter out only my roys

    const filteredRoys = roys.filter((royData) => royData._id?.address === address);
    const updateIndex = (type: ("Decade" | "Index" | "Channel")) => {
        if (type === "Index") {
            setDecade(0)
            setIndex(royIndex + 1)
            if (royIndex >= roys.length - 1) setIndex(0);
        }
        if (type === "Decade") {

            if (decade + 1 >= decadePie) return setDecade(0);
            setDecade(decade + 1)
        }
        if (type === "Channel") {

            if (channelIndex + 1 >= royStates.length) return setNewIndex(0);
            setNewIndex(channelIndex + 1)
        }
    }

    useEffect(() => {
        console.log(roys, royIndex, decade)
        if (!filteredRoys.length) return
        let royData = filteredRoys[royIndex].roy[decade]
        let rIndex = filteredRoys[royIndex]._id.uid
        let royAttributes: RoyAttributes = royData && royData
        roy = new Roy(rIndex, address, royAttributes)
        setRoy(roy)
        console.log(roy, royData)
    }, [address, royIndex, decade, roys])
    // Initialize SchemaEncoder with the schema string
    //
    //
    const RoyInterface = () => {
        return royChannels()

    }
    const Pie2Degrees = () => {
        const roySlice = royPie * (royIndex + 1) * 3.6
        const decadeSlice = 100 / decadePie * (decade + 1) * 3.6
        const stateSlice = 100 / royStates.length * (channelIndex + 1) * 3.6

        return (
            <>
                <Image
                    className="fixed cursor-pointer top-52 right-[510px]"
                    src="/button1.png"
                    style={{ transform: `rotate(${roySlice}deg)` }}
                    height={125}
                    width={125}
                    onClick={() => updateIndex("Index")}

                    alt="bg" />

                <Image
                    className="fixed cursor-pointer top-96  right-[490px]"
                    src="/button2.png"
                    style={{ transform: `rotate(${decadeSlice}deg)` }}
                    height={160}
                    width={160}
                    onClick={() => updateIndex("Decade")}

                    alt="bg" />
                <Image
                    className="fixed cursor-pointer bottom-52 right-[515px]"
                    src="/button2.png"
                    style={{ transform: `rotate(${stateSlice}deg)` }}
                    height={125}
                    width={125}
                    onClick={() => updateIndex("Channel")}

                    alt="bg" />

            </>)
    }

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
                        className="absolute top-80 left-40  backdrop-blur-lg rounded-full"
                    >
                        <Image
                            className="fixed"
                            fill
                            src="/RoyTitleScreen.png"
                            alt="Roy Title Screen"
                        />

                        <div
                            className="relative overflow-auto w-[500px] h-[450px] bg-gradient-to-b from-transparent to-gray-900 opacity-95 backdrop-blur-lg text-white p-12 rounded-badge">


                            <RoyInterface />

                        </div>


                    </div>

                    <Image
                        className="fixed left-[25%] top-6 pointer-events-none"
                        width={1000}
                        height={1000}
                        src="/royInterface.png"
                        alt="Roy Interface"
                    />
                    <div className="absolute right-12 p-2 border-2 w-[350px] top-0">
                        <Pie2Degrees />


                    </div>
                    <div className="flex-grow w-full mt-16 px-8 py-12">
                        {/* Other content */}
                    </div>

                    {/* Play Button */}


                </div>

            </div>
        </>
    );
};

export default Home;
