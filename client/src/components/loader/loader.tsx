import React from "react";
import "./loader.css";

interface IProps {
  marginTop?: string;
}

const Loader: React.FC<IProps> = (props: IProps) => {
  const marginTop = props.marginTop || 0;
  return (
    <div className="lds-ripple abs-center-x" style={{ marginTop: marginTop }}>
      <div />
      <div />
    </div>
  );
};
export default Loader;
