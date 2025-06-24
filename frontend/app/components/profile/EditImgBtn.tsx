import React from "react";
import { MdEdit } from "react-icons/md";
import { Button } from "../ui/button";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
};

const EditImgBtn: React.FC<Props> = ({ onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="absolute right-3 bottom-3 z-10 h-7 w-7 rounded-full bg-white p-0 shadow-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Edit profile picture"
      title="ערוך תמונת פרופיל"
    >
      <MdEdit size={20} color="#0088ed" />
    </Button>
  );
};

export default EditImgBtn;
