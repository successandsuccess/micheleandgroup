import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Pagination = ({
  offsetArr,
  pageSize,
  pageIndex,
  handleClick,
}: {
  offsetArr: any;
  pageSize: any;
  pageIndex: any;
  handleClick: any;
}) => {
  return (
    <div className="flex flex-row md:gap-3 gap-1">
      <p className="my-auto md:text-[20px] text-[14px] font-medium">
        {Number(Array.from(pageSize).toString()) * pageIndex + 1}-
        {Number(Array.from(pageSize).toString()) * (pageIndex + 1)}
      </p>
      <button
        className="px-[20px] rounded-xl bg-gray-300 font-bold text-black transition hover:bg-gray-400"
        onClick={() => handleClick(pageIndex - 1)}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      {pageIndex !== 0 ? (
        <button
          className="px-[20px] rounded-xl bg-gray-300 font-bold text-black transition hover:bg-gray-400"
          onClick={() => handleClick(pageIndex - 1)}
        >
          {pageIndex}
        </button>
      ) : (
        ""
      )}
      <button
        className="px-[20px] rounded-xl bg-black font-bold text-white transition hover:bg-gray-800"
        onClick={() => handleClick(pageIndex)}
      >
        {pageIndex + 1}
      </button>
      {offsetArr[pageIndex + 1] ? (
        <button
          className="px-[20px] rounded-xl bg-gray-300 font-bold text-black transition hover:bg-gray-400"
          onClick={() => handleClick(pageIndex + 1)}
        >
          {pageIndex + 2}
        </button>
      ) : (
        ""
      )}

      <button
        className="px-[20px] rounded-xl bg-gray-300 font-bold text-black transition hover:bg-gray-400"
        onClick={() => handleClick(pageIndex + 1)}
        disabled={offsetArr[pageIndex + 1] ? false : true}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
};
