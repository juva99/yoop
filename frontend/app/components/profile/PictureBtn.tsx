import React from "react";
import { Button } from "../ui/button";
import { SpinnerCircular } from "spinners-react";
import { MdEdit } from "react-icons/md";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
};

const AddImgBtn: React.FC<Props> = ({ onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="absolute right-1 bottom-1 z-10 h-7 w-7 rounded-full bg-white p-0 shadow-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {!disabled && <MdEdit size={20} color="#0088ed" />}

      {disabled && <SpinnerCircular size={20} color="#0088ed" />}
    </Button>
  );
};

export default AddImgBtn;
