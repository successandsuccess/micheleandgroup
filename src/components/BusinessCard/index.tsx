import { useRouter } from "next/router";

const BusinessCard = () => {
    const router = useRouter();

  return (
    <div className="w-full py-[100px] max-xl:py-[64px] max-md:py-[40px] relative bg-[#212121] contact-background rounded-3xl my-[50px]">
      <div className="flex flex-col justify-center gap-5">
        <p className="text-[40px] max-xl:text-[36px] max-lg:text-[24px] max-md:text-[22px] text-white text-center font-bold">
          Book the best talent in the business
        </p>
        <button onClick={() => router.push('/contact')} className="bg-primary py-[17px] px-[23px] max-md:py-[15px] max-md:px-[20px] w-[150px] mx-auto rounded-l-full rounded-r-full font-bold text-white">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default BusinessCard;
