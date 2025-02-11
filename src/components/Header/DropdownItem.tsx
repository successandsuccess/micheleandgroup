"use client";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from "react";

export const DropdownItems = ({
  href,
  text,
}: {
  href: string;
  text: string;
}) => {
  const [visible, setVisible] = useState(false);
  const handleMouseOut = () => {
    setVisible(false);
  };
  const handleMouseOver = () => {
    setVisible(true);
  };
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="min-w-[270px] flex flex-row gap-2 text-[16px] font-normal text-black"
    >
        <FontAwesomeIcon icon={faAngleRight} style={visible?{visibility: "visible"}:{visibility: "hidden"}} size="xs" className="pl-[5px] pt-[5px]"/>
      
      {text}
    </button>
  );
};
