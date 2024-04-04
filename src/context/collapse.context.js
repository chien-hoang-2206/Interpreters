import React, { useState, createContext } from "react";

export const CollapseContext = createContext();

export const CollapseProvider = ({ children }) => {
  const [isCollapse, setIsCollapse] = useState(false); 

  return (
    <CollapseContext.Provider value={{ isCollapse, setIsCollapse }}>
      {children}
    </CollapseContext.Provider>
  );
};
