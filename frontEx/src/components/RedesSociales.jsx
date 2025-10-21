import React from "react";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";

const Redes = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <button className="w-[90px] h-[90px] outline-none border-none bg-white rounded-[90px_5px_5px_5px] shadow-lg transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#cc39a4] group flex items-center justify-center">
          <svg
            className="mt-6 ml-5 fill-[#cc39a4] group-hover:fill-white"
            height={30}
            width={30}
            viewBox="0,0,256,256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Facebook />
          </svg>
        </button>
        <button className="w-[90px] h-[90px] outline-none border-none bg-white rounded-[5px_90px_5px_5px] shadow-lg transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#03A9F4] group flex items-center justify-center">
          <svg
            className="mt-6 -ml-4 fill-[#03A9F4] group-hover:fill-white"
            height={30}
            width={30}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Instagram />
          </svg>
        </button>
      </div>
      <div className="flex flex-row gap-2">
        <button className="w-[90px] h-[90px] outline-none border-none bg-white rounded-[5px_5px_5px_90px] shadow-lg transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#80ed99] group flex items-center justify-center">
          <svg
            className="mt-[-0.375rem] ml-5 fill-[#80ed99] group-hover:fill-white"
            height={30}
            width={30}
            viewBox="0 0 30 30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Twitter />
          </svg>
        </button>
        <button className="w-[90px] h-[90px] outline-none border-none bg-white rounded-[5px_5px_90px_5px] shadow-lg transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#8c9eff] group flex items-center justify-center">
          <svg
            className="mt-[-0.563rem] -ml-5 fill-[#8c9eff] group-hover:fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width={30}
            height={30}
          >
            <LinkedIn />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Redes;
