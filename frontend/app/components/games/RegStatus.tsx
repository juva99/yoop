import React from "react";

type Props = {
  text: string;
  icon: React.ReactNode;
};

const RegStatus: React.FC<Props> = ({ text, icon }) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default RegStatus;
