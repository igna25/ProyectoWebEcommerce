import { MouseEventHandler } from "react";

export interface CustomButtonProps {
    isDisabled?: boolean;
    btnType?: "button" | "submit";
    containerStyles?: string;
    textStyles?: "self-start rounded-lg bg-blue-500 px-2 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
    title: string;
    rightIcon?: string;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
  }