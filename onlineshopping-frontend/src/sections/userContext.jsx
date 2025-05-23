import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        user,
        setUser,
        setUpdateInfo,
        updateInfo,
        openHistory,
        setOpenHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
