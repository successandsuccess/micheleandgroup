import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

export const SubMenu = ({
  text,
  subhref,
  icon,
  children,
  height,
  index,
  sidebarArr,
  onClick
}: {
  children: ReactNode;
  text: string;
  subhref: string[];
  icon: IconProp;
  height: string;
  index: number;
  sidebarArr: Array<boolean>;
  onClick: any
}) => {
  const router = useRouter();
  const { asPath } = useRouter();

  const handleClick = (e:any) => {
    onClick(index);
  }

  useEffect(() => {
    // console.log('hello!');
    // console.log(asPath);
    // console.log(subhref);
    subhref.map((item) => {
      if(asPath.indexOf(item) > -1) onClick(index);
    })
    // if(subhref.indexOf(asPath) > -1)
    //   onClick(index);
  }, [asPath])

  return (
    <div
      className={`rounded-t-[25px] rounded-b-[25px] relative transition-all ${sidebarArr[index]?`${height}`:'h-[54px]'} ${subhref.indexOf(asPath) === -1 ? '' : ''} `}
    >
      <button
        className="w-full hover:bg-[#e7b53266] text-left font-medium p-[15px] rounded-l-full rounded-r-full text-[16px] flex flex-row gap-2"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={icon} className="my-auto" />
        {text}
      </button>
      <div
        className={`pl-[30px] pr-[20px] pb-[15px] flex flex-col max-h-[236px]  ${
          sidebarArr[index] ? "" : "hidden"
        }`}
        style={{}}
      >
        {children}
      </div>
     <div className={`absolute top-[15px] right-[15px] transition ${sidebarArr[index] ? 'rotate-90' : ''}`}>
        <FontAwesomeIcon icon={faAngleRight} />
     </div>
    </div>
  );
};
