import React from "react";
import { useState, useEffect } from "react";
import { RoyAttributes } from "../hooks/useRoy";
import { useSigner } from "../utils/wagmi-utils";
import { useAccount } from "wagmi";
import { useGlobalState } from "../store/store";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { newRoy, Roy } from "@/app/hooks/useRoy"; //took out advanceRoy, idk what that is.
import { useBotStore } from "../store/bot";
import toast from "react-hot-toast";
import { BotScreen } from "./AppComponent";
import Image from "next/image";

const BottomMiddleComponent: React.FC<{ additionalClasses?: string }> = ({
  additionalClasses,
}) => {
  const account = useAccount();
  const address: `0x${string}` = account.address ? account.address : "0x000";
  const botStore = useBotStore();
  const session = botStore.currentSession();
  const messages = session.messages.slice(session.messages.length - 10);
  const signer = useSigner();
  const state = useGlobalState((state) => state);
  const [resolution, setResolution] = useState("");
  const [location, setLocation] = useState("Manabi");
  const [year, setYear] = useState(1700);
  const [name, setName] = useState("Juan");
  const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";

  const eas = new EAS(easContractAddress);
  const roys = state.roys;
  let roy = state.roy;
  // Signer must be an ethers-like signer.
  //
  //filter out only my roys

  const filteredRoys = roys.filter(
    (royData) => royData._id?.address === address,
  );
  // Initialize SchemaEncoder with the schema string
  const attestRoy = async () => {
    const schemaUID =
      "0x8d915de0951fc02b7f25f1744f77737e017ffb132057b5debd0c9ec7df2cc343";
    const eas = new EAS(easContractAddress);
    // Signer must be an ethers-like signer.

    if (!signer) return;
    eas.connect(signer);
    // Initialize SchemaEncoder with the schema string
    const offchain = await eas.getOffchain();
    const schemaEncoder = new SchemaEncoder(
      "string royName,string royLocation,uint24 royYear",
    );
    const encodedData = schemaEncoder.encodeData([
      { name: "royName", value: name, type: "string" },
      { name: "royLocation", value: location, type: "string" },
      { name: "royYear", value: year, type: "uint24" },
    ]);
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0x0000000000000000000000000000000000000000",
        expirationTime: BigInt(0),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
        value: BigInt(5),
      },
    });

    let uid = await tx.wait();
    toast.success("Attesting ROY!");
    roy = await newRoy(uid, address, name, location, Number(year));
    state.setRoy(roy);
    toast.success("Roy Attested!");
    console.log(uid);
  };

  const advanceRoy = async (resolution: string) => {
    if (!account.address || !signer) return console.log("no account address");
    eas.connect(signer);
    const offchain = await eas.getOffchain();
    const schemaUID =
      "0x64f9c0f771b33583107be7ef7532e23ef8e0154919e40a1f14a67ca519a92a0e";
    // Signer must be an ethers-like signer.
    // Initialize SchemaEncoder with the schema string

    const schemaEncoder = new SchemaEncoder("string royResolution");
    const encodedData = schemaEncoder.encodeData([
      { name: "royResolution", value: resolution, type: "string" },
    ]);
    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        version: 1,
        recipient: address,
        expirationTime: BigInt(0),
        time: BigInt(0),
        revocable: true,
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        // Be aware that if your schema is not revocable, this MUST be false
        schema: schemaUID,
        data: encodedData,
      },
      signer,
    );

    const updatedData = JSON.stringify(
      offchainAttestation,
      (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
    );

    let uid = offchainAttestation.uid;
    console.log("New attestation UID:", uid);
    await newRoy(uid, name, location, Number(year));
  };

  // attest sending roy
  // create story
  // embed results
  // upload to db

  return (
    <div
      className={`bg-green-700 border-black border rounded-xl z-10 min-w-[400px] min-h-[300px] mx-auto my-10 ${additionalClasses} fixed bottom-0 left-1/2 transform -translate-x-1/2 p-4 text-center flex flex-col justify-between`}
    >
      <div className=" left-1/2 transform -translate-x-4/2">
        <ul className="text-2xl font-bold text-white py-3 px-2 rounded-full cursor-pointer">
          <label>
            {" "}
            Name
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                e.stopPropagation();
              }}
            />
          </label>
          <br />
          <label>
            {" "}
            Location
            <input
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                e.stopPropagation();
              }}
            />
          </label>
          <br />
          <label>
            {" "}
            Year
            <input
              value={year}
              onChange={(e) => {
                setYear(Number(e.target.value));
                e.stopPropagation();
              }}
            />
          </label>
          <br />
        </ul>
      </div>
      <button
        onClick={() => attestRoy()}
        className="bg-red-500 text-white my-1 py-2 px-4 rounded fixed bottom-2 left-1/2 transform -translate-x-1/2"
      >
        Submit
      </button>
    </div>
  );
};

export default BottomMiddleComponent;
