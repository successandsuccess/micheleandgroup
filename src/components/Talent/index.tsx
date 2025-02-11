import { useRouter } from "next/router";
import { FontAwesomeIcon,  } from "@fortawesome/react-fontawesome";
import {
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const Talent = ({
  src,
  name,
  location,
  id,
  handleClick,
  rating,
}: {
  src: string;
  name: string;
  location: string;
  id: string;
  handleClick: any;
  rating: number;
}) => {
  return (
    <div
      className="p-[15px] border-[2px] rounded-lg flex flex-col gap-[20px] cursor-pointer hover:border-[#d63384] transition"
      onClick={() => handleClick(id, name, src)}
    >
      <img
        src={src ? src : "/assets/images/Placeholder_view_vector.svg"}
        className="w-[240px] mx-auto h-[300px] object-cover object-top rounded-xl"
        style={{ imageRendering: "auto" }}
      />
      <p className="font-bold text-[18px]">{name}</p>
      <div className="flex flex-row gap-1 max-md:mx-auto">
        {[0, 1, 2, 3, 4].map((item: number) => (
          <FontAwesomeIcon
            icon={faStar}
            key={"rating" + item}
            className={`${
              item < rating ? "text-[#ff4081]" : "text-[#eee]"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-400">{location}</p>
    </div>
  );
};

export default Talent;
