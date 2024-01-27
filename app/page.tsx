"use client"
import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BotScreen } from "./components/AppComponent";
import Image from "next/image";
import houseBackground from "../public/RoyLogo.png";
import { useRoy, advanceRoy } from "@/app/hooks/useRoy";
import { useAccount } from "wagmi";
import { useSigner } from "./utils/wagmi-utils";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useBotStore } from "./store/bot";
import { useGlobalState } from "./store/store";
import { ChatMessage } from "./store/session";
import { useState } from "react";

const Home: NextPage = () => {
    const account = useAccount()
    const address: `0x${string}` = account.address ? account.address : "0x000";
    const botStore = useBotStore();
    const session = botStore.currentSession();
    const messages = session.messages.slice(session.messages.length - 10);
    const signer = useSigner();
    const state = useGlobalState(state => state);
    const [resolution, setResolution] = useState("");

    const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";


    // Signer must be an ethers-like signer.

    // Initialize SchemaEncoder with the schema string



    const useGetRoy = async () => {
        if (!signer) return;
        const eas = new EAS(easContractAddress);
        eas.connect(signer);
        const offchain = await eas.getOffchain();
        if (!account.address) return console.log("no account address");
        const roys = state.roys;
        const myPilot = roys?.filter(state => state.address === account.address)
        await useRoy("be good", "Vancouver", 1980, "Matt", account.address, offchain, signer)
    }
    // attest sending roy
    // create story
    // embed results
    // upload to db







    return (
        <div className="relative min-h-screen">
            {/* Background Image */}


            {/* Main Content */}
            <div className="relative z-10 flex flex-col text-black items-center flex-grow pt-10">
                <div className="px-5">
                    <h1 className="text-center mb-8">
                        <span className="block text-2xl mb-2">Welcome to</span>
                        <span className="block text-4xl font-bold">
                            Roy: A Life Well Lived
                        </span>
                    </h1>

                    <div
                        className="relative left-[17%] items-center w-2/3 h-1/2 backdrop-blur-lg"

                    >
                        <Image
                            src={houseBackground}
                            fill
                            alt="bg" />

                        <div
                            className="top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-80 backdrop-blur-lg text-white p-24">
                            <BotScreen />


                        </div>

                    </div>
                </div>

                <div className="flex-grow w-full mt-16 px-8 py-12">
                    {/* Other content */}
                </div>
            </div>

            {/* Play Button */}
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                <span className="text-2xl font-bold bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full animate-bounce cursor-pointer"


                >
                    <label
                    > New Resolution  <input onChange={e => { setResolution(e.target.value); e.stopPropagation() }} /></label>
                    <button
                        onClick={() => useGetRoy()}
                    >A Button</button>
                </span>
            </div>
        </div>
    );
};

export default Home;
