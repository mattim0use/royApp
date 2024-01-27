"use client"
import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BotScreen } from "./components/AppComponent";
import Image from "next/image";
import houseBackground from "../public/RoyLogo.png";
import { createRoy } from "@/app/hooks/newRoy";
import { useAccount } from "wagmi";
import { useSigner } from "./utils/wagmi-utils";
import { Roy } from "./types/appTypes";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useBotStore } from "./store/bot";

const Home: NextPage = () => {
    const account = useAccount()
    const address = account.address ? account.address : "0x000";
    const botStore = useBotStore();
    const session = botStore.currentSession();
    const messages = session.messages.slice(session.messages.length - 10);
    const signer = useSigner();

    let roy = {
        address: address,

    } as Roy;


    // attest sending roy
    // create story
    // embed results
    // upload to db
    const attestRoy = async (name: string) => {

        const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
        const schemaUID = "0x2e9af8cbe5bcedbde5ecc9374d6525f893c98db76a932916550b6d272404c6d5";
        const eas = new EAS(easContractAddress);
        // Signer must be an ethers-like signer.

        if (!signer) return;
        await eas.connect(signer);
        // Initialize SchemaEncoder with the schema string
        const offchain = await eas.getOffchain();
        const schemaEncoder = new SchemaEncoder("string royName");
        const encodedData = schemaEncoder.encodeData([
            { name: "royName", value: name, type: "string" }
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

        roy.uid = offchainAttestation.uid;
        console.log("New attestation UID:", updatedData);
    }

    const advanceRoy = async (resolution: string) => {

        const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
        const schemaUID = "0x64f9c0f771b33583107be7ef7532e23ef8e0154919e40a1f14a67ca519a92a0e";
        const eas = new EAS(easContractAddress);
        // Signer must be an ethers-like signer.

        if (!signer) return;
        await eas.connect(signer);
        // Initialize SchemaEncoder with the schema string
        const offchain = await eas.getOffchain();
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
                refUID: roy.uid,
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

        roy.uid = offchainAttestation.uid;
        console.log("New attestation UID:", updatedData);
    }

    const newRoy = async (name: string, messages: string[]) => {
        roy.name = name;
        roy.messages = messages;
        roy.count = 0;
        await attestRoy(name);
        createRoy(roy);
    }

    const newDecade = async (resolution: string) => {
        await advanceRoy(resolution);
        createRoy(roy);
    }




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
                    onClick={() => newRoy("Roy")}

                >
                    Play Roy
                </span>
            </div>
        </div>
    );
};

export default Home;
