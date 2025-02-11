import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { clientAuth } from "@/lib/firebaseclient";
const SearchCard = ({
  src,
  name,
  location,
  id,
  rating,
  disabled,
  onClick,
  index,
  full,
}: {
  src: string;
  name: string;
  location: string;
  id: string;
  rating: number;
  disabled?: boolean;
  onClick?: any;
  index?: number;
  full?: boolean;
}) => {
  const router = useRouter();
  const redirectToExternalUrl = (url: string) => {
    const win = window.open(url, "_blank");
    win?.focus();
  };

  return (
    <div
      className={`p-[15px] border-[2px] rounded-lg flex flex-col gap-[20px] ${
        disabled ? "cursor-pointer" : "cursor-pointer"
      } hover:border-[#d63384] transition`}
      onClick={() => {
        if (!disabled) {
          redirectToExternalUrl(`/dashboard/talents/${id}`);
        } else onClick(index);
      }}
    >
      <img
        src={src ? src : "/assets/images/Placeholder_view_vector.svg"}
        className={` ${
          !full ? "object-cover object-top w-[240px] mx-auto h-[300px]" : ""
        }  rounded-xl`}
        style={{ imageRendering: "auto" }}
      />
      <p className="font-bold text-[18px]">{name}</p>

      {clientAuth?.currentUser ? (
        <div className="flex flex-row gap-1 max-md:mx-auto">
          {[0, 1, 2, 3, 4].map((item: number) => (
            <FontAwesomeIcon
              icon={faStar}
              key={"rating" + item}
              className={`${item < rating ? "text-[#ff4081]" : "text-[#eee]"}`}
            />
          ))}
        </div>
      ) : (
        <></>
      )}
      <p className="text-gray-400">{location}</p>
    </div>
  );
};

export default SearchCard;
