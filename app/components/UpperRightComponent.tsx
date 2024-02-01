import React, { useEffect, useState } from "react";
import { useGlobalState } from "@/app/store/store";
import { useAccount } from "wagmi";
import { RoyAttributes, Roy } from "@/app/hooks/useRoy";
import Image from "next/image";

const UpperRightComponent: React.FC = () => {
  const [index, setIndex] = useState(0);
  const state = useGlobalState((state) => state);

  const roys = state.roys;
  const roy = state.roy;
  console.log(roys);

  const RoyExperiences = () => {
    if (!roy.attributes) return;
    const updateRoyIndex = () => {
      setIndex(index + 1);
      if (index >= roy.attributes.experiences.length - 1) setIndex(0);
    };
    console.log(roy);
    return (
      <div
        onClick={() => updateRoyIndex()}
        className="flex flex-row cursor-pointer border-2 border-green-500 h-[150px] mt-4 text-lg overflow-auto p-1"
      >
        <li>
          <strong>
            Life Event: <br />
            {roy.attributes.experiences[index]?.type}
          </strong>{" "}
          : {roy.attributes.experiences[index]?.description}
        </li>
      </div>
    );
  };

  //${roySlice.toString()}deg

  return (
    <>
      <div className="absolute right-10 top-[10px] p-2 w-[500px] h-[400px]">
        <div className="flex flex-row w-full h-full">
          {roy.attributes && (
            <>
              <ul className="p-6 m-2 w-full h-full">
                <li>
                  <strong>Name:</strong> {roy.attributes?.name}
                </li>
                <li>
                  <strong>Current Location: </strong>{" "}
                  {roy.attributes?.currentLocation}
                </li>
                <li>
                  <strong>Current Year:</strong> {roy.attributes?.currentYear}
                </li>
                <li>
                  <strong>Current Decade:</strong> {roy.attributes?.count}
                </li>
                <li>
                  <strong>Resolution:</strong> {roy?.currentDecadeResolution}
                </li>
                <div className="abesolute">
                  <RoyExperiences />
                </div>
                <Image
                  src={roy.attributes.image || "/RoyTitleScreen.png"}
                  height={100}
                  width={100}
                  className="fixed top-20 right-24"
                  alt="bg"
                />
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UpperRightComponent;
