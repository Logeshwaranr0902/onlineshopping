import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";

const Popup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-gray-100/90 rounded-2xl p-6 shadow-lg w-fit h-fit pb-7 px-7 relative">
        <h2 className="text-lg font-bold text-center ">CONTACT DETAILS</h2>
        <div className=" w-full items-center mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <p>
              <span className="mr-1">
                <EmailIcon />
              </span>{" "}
              sunrisemart@gmail.com
            </p>
            <p>
              <span className="">
                <CallIcon />{" "}
              </span>
              (022) 1234 5678
            </p>
            <p>
              <span className="mr-1">
                <WhatsAppIcon />
              </span>
              +91 9876979879
            </p>
          </div>
        </div>
        <button
          className="mt-4 px-3 py-1 bg-red-600/80 text-white rounded-xl absolute right-[4px] -top-[12px] "
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Popup;
