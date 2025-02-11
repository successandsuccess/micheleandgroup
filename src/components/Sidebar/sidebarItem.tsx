import useParticipantStore from "@/store/use-participant";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export const SidebarItem = ({ text, href, icon, pattern }: { text: string; href: string, icon:IconProp, pattern?: any }) => {
  const router = useRouter();
  const { asPath } = useRouter();
  const { setDashboardMenu } = useParticipantStore((state) => state);

  const handleClick = () => {
    router.push(href);
    setDashboardMenu(false);
  }

  return (
    <button
      className="w-full hover:bg-[#e7b53266] text-left font-medium p-[15px] rounded-l-full rounded-r-full text-[16px] flex flex-row gap-2"
      onClick={handleClick}
      style={pattern?.test(asPath) ? { backgroundColor: "#e7b532", color: '#000' } : {}}
    >
      <FontAwesomeIcon icon={icon} className="my-auto"/>
      {text}
    </button>
  );
};
