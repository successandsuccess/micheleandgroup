import { GetMale } from "@/actions/page/getMale";
import BusinessCard from "@/components/BusinessCard";
import Footer from "@/components/Footer";
import ImageInput from "@/components/ImageInput";
import ModelSearchItem from "@/components/ModelSearchItem";
import Paragraph from "@/components/Paragraph";
import TalentCard from "@/components/TalentCard";
import HomeSectionLayout from "@/components/layouts/home-section";
import useParticipantStore from "@/store/use-participant";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { GetFemale } from "@/actions/page/getFemale";
import { GetLife } from "@/actions/page/getLife";
import { GetMake } from "@/actions/page/getMake";

export default function FemaleModel() {
  const { setDataLoading } = useParticipantStore((state) => state);

  const [Description, setDescription] = useState("");
  const [Talents, setTalents] = useState<Array<string>>([]);
  const [Model, setModel] = useState("");
  const [Header, setHeader] = useState("");

  useEffect(() => {
    (async () => {
      setDataLoading(true);
      const record = await GetMake();
      const data = await JSON.parse(record?.data?.data?.fields?.Data);
      setDescription(data.Description);
      setTalents(data.Image);
      setHeader(data.Header);
      setModel(data.Model);
      setDataLoading(false);
    })();
  }, []);
  return (
    <main className={`min-h-screen`}>
      <div className="bg-[rgba(231,181,50,0.1)]">
        <HomeSectionLayout>
          <div className="flex lg:flex-row flex-col lg:justify-between w-full  ml-[50%] translate-x-[-50%] items-center ">
            <p className="text-[72px] max-xl:text-[64px] font-bold max-lg:hidden">
              {Header}
            </p>
            <div className="max-h-[395px] mr-[4.5%] overflow-hidden">
              <img
                src={Model}
                className="align-middle max-h-[395px]"
              />
            </div>
            <p className="lg:hidden md:text-[50px] sm:text-[42px] text-[36px] font-bold text-center my-[20px]">
              {Header}
            </p>
          </div>
        </HomeSectionLayout>
      </div>
      <HomeSectionLayout>
        <div className="mt-[50px] mb-[50px]">
          <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-2 max-lg:grid-cols-1">
            {Talents?.map((item: string, index: number) => (
              <TalentCard
                image={item}
                name="Christina Rhodes"
                key={"talent" + index}
              />
            ))}
          </div>
          {/* </div> */}
        </div>
      </HomeSectionLayout>
      <div className="primary-gradient pt-[50px]">
        <HomeSectionLayout>
          <div className="mb-5">{parse(Description || "")}</div>
          <p className="font-bold text-[18px] mt-[50px] mb-[50px] max-md:mt-[50px] max-md:mb-[0px] max-md:text-[16px]">
            If you would like our agency to provide you with talent for your
            specific advertising campaign or promotional event,{" "}
            <span className="text-primary">call 386-676-1702.</span>
          </p>
          <BusinessCard />
        </HomeSectionLayout>
      </div>
      <Footer />
      <p className="text-center bg-[#eeeeee] text-[#212121] text-[14px] py-[11px]">
        Copyright 2023 Michele & Group, Inc., All Rights Reserved | State
        License #TA0000236
      </p>
    </main>
  );
}
