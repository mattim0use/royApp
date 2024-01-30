import React from "react";

const BottomRightComponent: React.FC = () => {
  return (
    <div className="bg-red-500 border-white border rounded-xl z-10 min-w-[400px] min-h-[400px] mx-10 my-10 fixed bottom-0 right-0 p-4 text-center">
      <p>Bottom Right Component</p>
    </div>
  );
};

export default BottomRightComponent;
