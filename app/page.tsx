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
    const account = useAccount()
    const address: `0x${string}` = account.address ? account.address : "0x000";
    const botStore = useBotStore();
    const session = botStore.currentSession();
    const messages = session.messages.slice(session.messages.length - 10);
    const signer = useSigner();
    const state = useGlobalState(state => state);
    const [resolution, setResolution] = useState("");
    const [location, setLocation] = useState("Manabi");
    const [year, setYear] = useState(1700);
    const [name, setName] = useState("Juan");
    const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
    const [royIndex, setIndex] = useState(0)
    const [decade, setDecade] = useState(0)
    const [index, setNewIndex] = useState(0)





    const eas = new EAS(easContractAddress);

    const roys = state.roys;
    let roy = state.roy;
    console.log(roys);
    // Signer must be an ethers-like signer.
    //
    const setRoy = useGlobalState(state => state.setRoy)
    //filter out only my roys

    const filteredRoys = roys.filter((royData) => royData._id?.address === address);
    const updateIndex = (type: ("Decade" | "Index")) => {
        if (type === "Index") {
            setDecade(0)
            setIndex(royIndex + 1)
            if (royIndex >= filteredRoys.length - 1) setIndex(0);
        }
        if (type === "Decade") {

            if (decade + 1 >= filteredRoys[royIndex].roy.length) return setDecade(0);
            setDecade(decade + 1)
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
    }, [address, royIndex, decade, index, roys])
    // Initialize SchemaEncoder with the schema string
    const attestRoy = async (
    ) => {

        const schemaUID = "0x2f7d623600c57b6457cb782da8ae13105507c11e1500377672f9d4236f9dd6ec";
        const eas = new EAS(easContractAddress);
        // Signer must be an ethers-like signer.

        if (!signer) return;
        eas.connect(signer);
        // Initialize SchemaEncoder with the schema string
        const offchain = await eas.getOffchain();
        const schemaEncoder = new SchemaEncoder("string royName,string royLocation,uint24 royYear");
        const encodedData = schemaEncoder.encodeData([
            { name: "royName", value: name, type: "string" },
            { name: "royLocation", value: location, type: "string" },
            { name: "royYear", value: year, type: "uint24" }
        ]);
        const offchainAttestation = await offchain.signOffchainAttestation(
            {
                version: 1,
                recipient: address,
                expirationTime: BigInt(0),
                time: BigInt(0),
                revocable: true,
                refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                // Be aware that if your schema is not revocable, this MUST be false
                schema: schemaUID,
                data: encodedData,
            },
            signer,
        )

        const updatedData = JSON.stringify(
            offchainAttestation,
            (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        );

        let uid = offchainAttestation.uid;
        console.log("New attestation UID:", updatedData);
        roy = await newRoy(uid, address, name, location, Number(year))
        state.setRoy(roy);
        toast.success("Roy Attested!");
    }



    const advanceRoy = async (
        resolution: string,

    ) => {


        if (!account.address || !signer) return console.log("no account address");
        eas.connect(signer);
        const offchain = await eas.getOffchain();
        const schemaUID = "0x64f9c0f771b33583107be7ef7532e23ef8e0154919e40a1f14a67ca519a92a0e";
        // Signer must be an ethers-like signer.
        // Initialize SchemaEncoder with the schema string

        const schemaEncoder = new SchemaEncoder("string royResolution");
        const encodedData = schemaEncoder.encodeData([
            { name: "royResolution", value: resolution, type: "string" }
        ]);
        const offchainAttestation = await offchain.signOffchainAttestation(
            {
                version: 1,
                recipient: address,
                expirationTime: BigInt(0),
                time: BigInt(0),
                revocable: true,
                refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                // Be aware that if your schema is not revocable, this MUST be false
                schema: schemaUID,
                data: encodedData,
            },
            signer,
        )

        const updatedData = JSON.stringify(
            offchainAttestation,
            (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        );

        let uid = offchainAttestation.uid;
        console.log("New attestation UID:", uid);
        await newRoy(uid, name, location, Number(year))
    }


    // attest sending roy
    // create story
    // embed results
    // upload to db


    const RoyExperiences = () => {
        if (!roy.attributes) return
        const updateRoyIndex = () => {
            setNewIndex(index + 1)
            if (index >= roy.attributes.experiences.length - 1) setNewIndex(0)
        }
        console.log(roy)
        return (
            <div onClick={() => updateRoyIndex()} className="flex flex-row cursor-pointer border-2 h-[100px] overflow-auto">
                <li><strong>Life Event: <br />{roy.attributes.experiences[index]?.type}</strong> : {roy.attributes.experiences[index]?.description}</li>
            </div>)
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

                <div className="fixed z-10 flex flex-col text-black items-center flex-grow pt-10">
                    <div
                        className="relative  items-center w-2/3 h-1/2 backdrop-blur-lg"

                    >
                        <Image
                            src={roy.attributes?.image || "/image.png"}
                            fill
                            alt="bg" />


                        <div className="px-5">

                            <div
                                className="top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-80 backdrop-blur-lg text-white p-24">
                                <h1 className="text-center mb-8">
                                    <span className="block text-2xl mb-2">Welcome to</span>
                                    <span className="block text-4xl font-bold">
                                        Roy: A Life Well Lived
                                    </span>
                                </h1>


                                <span
                                    className="cursor-pointer"
                                    onClick={() => updateIndex("Index")}
                                >Roy:{royIndex + 1} of {filteredRoys.length}</span>
                                <span
                                    className="cursor-pointer"
                                    onClick={() => updateIndex("Decade")}
                                >{" "} Decade :{decade + 1} of {filteredRoys[royIndex]?.roy.length}</span>

                                <div className="p-2 border-2 h-[900px]">
                                    <div className="flex flex-row w-full h-full overflow-auto">

                                        {roy.attributes && (
                                            <>
                                                <ul className="p-2 m-2 w-full">
                                                    <li><strong>Name:</strong> {roy.attributes?.name}</li>
                                                    <li><strong>Current Location: </strong> {roy.attributes?.currentLocation}</li>
                                                    <li><strong>Current Year:</strong>  {roy.attributes?.currentYear}</li>
                                                    <li><strong>Current Decade:</strong>  {roy.attributes?.count}</li>
                                                    <li><strong>Resolution:</strong>  {roy?.currentDecadeResolution}</li>

                                                    <RoyExperiences />
                                                    <Image
                                                        src={roy.attributes.image}
                                                        height={200}
                                                        width={200}
                                                        className="border-2"
                                                        alt="bg" />
                                                </ul>

                                            </>
                                        )
                                        }

                                        <BotScreen />
                                    </div>

                                </div>



                            </div>


                        </div>
                    </div>

                    <div className="flex-grow w-full mt-16 px-8 py-12">
                        {/* Other content */}
                    </div>

                    {/* Play Button */}
                    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                        <ul className="text-2xl font-bold bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full  cursor-pointer"


                        >
                            <label
                            > Name<input value={name} onChange={e => { setName(e.target.value); e.stopPropagation() }} /></label><br />
                            <label
                            > Location<input value={location} onChange={e => { setLocation(e.target.value); e.stopPropagation() }} /></label><br />
                            <label
                            > Year<input value={year} onChange={e => { setYear(Number(e.target.value)); e.stopPropagation() }} /></label><br />
                            <button
                                onClick={() => attestRoy()}
                            >A Button</button>
                        </ul>
                    </div>

                </div>
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
