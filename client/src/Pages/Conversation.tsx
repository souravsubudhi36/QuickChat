import React, { useState, useEffect } from "react";
import Desktop from "./Conversation/Desktop";
import Mobile from "./Conversation/Mobile";

const Conversation: React.FC = () => {
  const [isDesktop, changeIsDesktop] = useState(window.innerWidth > 600);

  const calculateViewPort = () => {
    changeIsDesktop(window.innerWidth > 600);
  };

  useEffect(() => {
    window.addEventListener("resize", calculateViewPort);

    return () => {
      window.removeEventListener("resize", calculateViewPort);
    };
  }, []);

  return (
    <React.Fragment>{isDesktop ? <Desktop /> : <Mobile />}</React.Fragment>
  );
};

export default Conversation;
