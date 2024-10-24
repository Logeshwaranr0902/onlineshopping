import React, { useState } from "react";

const Notification = () => {
  const [openNotification, setOpenNotification] = useState(true);
  const handleClose = () => {
    setOpenNotification(false);
  };
  if (!openNotification) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-gray-100/90 rounded-2xl p-6 shadow-lg w-[500px] text-center space-y-3 h-fit pb-7 px-7 relative ">
        <h1 className="text-2xl">Thank you for visiting my website!!</h1>
        <h2 className="text-red-700 underline">
          Please read this for a moment!
        </h2>
        <h3>
          The e-commerce website you're visiting was built entirely by me,
          without spending any money. Please note that when you first try to
          sign in or sign up, there might be a 3-4 minute wait. This is because
          the backend is hosted on Render, which, with the free version, has a
          delay of about 50 seconds for the initial connection after a period of
          inactivity. However, this delay only happens the first time you access
          it. Additionally, the product images are fetched through an API that
          has a limit of 200 images per hour for the free version. So, you might
          not see all images immediately, but don't worry—once fetched, the
          images are stored in your browser cache. If you revisit the site those
          already fetched images are available and the api fetches some new
          images.
        </h3>
        <button
          onClick={handleClose}
          className="mt-4 px-3 py-1 bg-red-600/80 text-white rounded-xl absolute right-[4px] -top-[10px] "
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Notification;
