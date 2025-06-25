import React from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { Button } from "../ui/button";
import { SpinnerCircular } from "spinners-react";
import { MdEdit } from "react-icons/md";

export enum Action {
  ADD = "ADD",
  EDIT = "EDIT",
}

type Props = {
  onClick?: () => void;
  action: Action;
  disabled?: boolean;
};

const AddImgBtn: React.FC<Props> = ({ onClick, disabled, action }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="absolute right-3 bottom-3 z-10 h-7 w-7 rounded-full bg-white p-0 shadow-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {!disabled && action === Action.ADD && (
        <IoAddCircleSharp size={20} color="#0088ed" />
      )}
      {!disabled && action === Action.EDIT && (
        <MdEdit size={20} color="#0088ed" />
      )}

      {disabled && <SpinnerCircular size={20} color="#0088ed" />}
    </Button>
  );
};

export default AddImgBtn;
