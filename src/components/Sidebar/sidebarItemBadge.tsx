import useParticipantStore from "@/store/use-participant";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export const SidebarItemWithBadge = ({ text, href, icon, badge }: { text: string; href: string, icon:IconProp, badge:boolean }) => {
  const router = useRouter();
  const { asPath } = useRouter();
  const { setDashboardMenu } = useParticipantStore((state) => state);

  const handleCLick = () => {
    setDashboardMenu(false);
    router.push(href);
  }

  return (
    <button
      className="w-full hover:bg-[#e7b53266] text-left font-medium p-[15px] rounded-l-full rounded-r-full text-[16px] flex flex-row justify-between"
      onClick={handleCLick}
      style={asPath.indexOf(href) >= 0 ? { backgroundColor: "#e7b532", color: '#000' } : {}}
    >
      <div className="flex flex-row gap-2">
      <FontAwesomeIcon icon={icon} className="my-auto"/>
      {text}
      </div>
      <FontAwesomeIcon icon={faCircleExclamation} className={`text-red-400 my-auto transition-all h-[20px] ${badge? "opacity-100": "opacity-0"}`} />
    </button>
  );
};
