import React from "react";

const UpperLeftComponent: React.FC = () => {
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


    return (
        <div className="bg-green-500 border-white border rounded-xl z-10 min-w-[400px] min-h-[400px] mx-10 my-10 fixed top-0 left-0 p-4 text-center">
            <span
                className="cursor-pointer"

            >Roy:{royIndex + 1} of {filteredRoys.length}</span>
            <span
                className="cursor-pointer"

            >{" "} Decade :{decade + 1} of {filteredRoys[royIndex]?.roy.length}</span>
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

            </div>

        </div>
    );
};

export default UpperLeftComponent;
