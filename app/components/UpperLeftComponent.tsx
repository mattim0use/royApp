import React from "react";

const UpperLeftComponent: React.FC = () => {
  return (
    <div className="bg-green-500 border-white border z-10 min-w-[400px] min-h-[400px] mx-10 my-10 fixed top-0 left-0 p-4 text-center">
      <p>Upper Left Component</p>
    </div>
  );
};

export default UpperLeftComponent;
