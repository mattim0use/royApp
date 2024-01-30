import React from "react";

const BottomLeftComponent: React.FC = () => {
  return (
    <div className="bg-green-500 border-white border z-10 min-w-[400px] min-h-[400px] mx-10 my-10 fixed bottom-0 left-0 p-4 text-center">
      <p>Bottom Left Component</p>
    </div>
  );
};

export default BottomLeftComponent;
