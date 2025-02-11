const HowDoesItWork = ({ data }: { data: any }) => {
  return (
    <div className="grid min-[770px]:grid-cols-2 grid-cols-1 gap-10">
      <div className="my-auto flex flex-col justify-center">
        <p className="text-[36px] font-bold mb-[20px] max-xl:text-[28px] max-lg:text-[24px] ">
          {data?.[0]?.SubHeader}
        </p>
        <p className="text-[18px] font-medium leading-loose max-xl:text-[16px] max-md:text-[14px] max-xl:leading-relaxed">
          {data?.[0]?.Description}
        </p>
      </div>
      <img className="rounded-3xl my-auto" src={data?.[0]?.Image} />
      <div className="my-auto flex flex-col justify-center min-[770px]:hidden">
        <p className="text-[36px] font-bold mb-[20px] max-xl:text-[28px] max-lg:text-[24px]">
          {data?.[1]?.SubHeader}
        </p>
        <p className="text-[18px] font-medium leading-loose  max-xl:text-[16px] max-md:text-[14px]">
          {data?.[1]?.Description}
        </p>
      </div>
      <img className="rounded-3xl  my-auto" src={data?.[1]?.Image} />
      <div className="my-auto flex flex-col justify-center max-[770px]:hidden">
        <p className="text-[36px] font-bold mb-[20px] max-xl:text-[28px] max-lg:text-[24px]">
          {data?.[1]?.SubHeader}
        </p>
        <p className="text-[18px] font-medium leading-loose  max-xl:text-[16px] max-md:text-[14px]">
          {data?.[1]?.Description}
        </p>
      </div>
      <div className="my-auto flex flex-col justify-center">
        <p className="text-[36px] font-bold mb-[20px] max-xl:text-[28px] max-lg:text-[24px]">
          {data?.[2]?.SubHeader}
        </p>
        <p className="text-[18px] font-medium leading-loose  max-xl:text-[16px] max-md:text-[14px]">
          {data?.[2]?.Description}
        </p>
      </div>
      <img className="rounded-3xl  my-auto" src={data?.[2]?.Image} />
      <div className="my-auto flex flex-col justify-center min-[770px]:hidden">
        <p className="text-[36px] font-bold mb-[20px] max-xl:text-[28px] max-lg:text-[24px]">
          {data?.[3]?.SubHeader}
        </p>
        <p className="text-[18px] font-medium leading-loose  max-xl:text-[16px] max-md:text-[14px]">
          {data?.[3]?.Description}
        </p>
      </div>
      <img className="rounded-3xl  my-auto" src={data?.[3]?.Image} />
      <div className="my-auto flex flex-col justify-center max-[770px]:hidden">
        <p className="text-[36px] font-bold mb-[20px] max-xl:text-[28px] max-lg:text-[24px]">
          {data?.[3]?.SubHeader}
        </p>
        <p className="text-[18px] font-medium leading-loose  max-xl:text-[16px] max-md:text-[14px]">
          {data?.[3]?.Description}
        </p>
      </div>
    </div>
  );
};

export default HowDoesItWork;
