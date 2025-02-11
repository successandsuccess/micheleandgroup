import Image from "next/image";
import { Inter } from "next/font/google";
import HomeSectionLayout from "@/components/layouts/home-section";
import ImageCarousel from "@/components/Carousel";
import HowDoesItWork from "@/components/HowDoesItWork";
import BusinessCard from "@/components/BusinessCard";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import useParticipantStore from "@/store/use-participant";
import { GetHome } from "@/actions/page/getHome";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { setDataLoading } = useParticipantStore((state) => state);

  const [hero, setHero] = useState<any>();
  const [talents, setTalents] = useState<any>();
  const [section, setSection] = useState<any>();

  useEffect(() => {
    (async () => {
      setDataLoading(true);
      const data = await GetHome();
      const hero_data = await JSON.parse(data.hero.data.fields.Data);
      console.log(hero_data);
      setHero(hero_data);
      const talent_data = await JSON.parse(data.talents.data.fields.Data);
      const section_data = await JSON.parse(data.section.data.fields.Data);
      setTalents(talent_data);
      setSection(section_data);
      setDataLoading(false);
    })();
  }, []);
  return (
    <main className={`min-h-screen`}>
      {/* Section1 */}
      {/* <div className="grid min-h-[100vh] min-[600px]:grid-cols-2 bg-[#e7b53219]">
        <div className="flex flex-row min-[600px]:justify-end">
          <div className="font-bold flex flex-col justify-center w-[80%] min-[600px]:mr-[20px] max-[600px]:gap-[20px] max-[600px]:px-[16px] max-[600px]:pb-[34px] max-[600px]:pt-[48px]">
            <p className="text-primary text-[1.5rem] max-xl:text-[18px] max-md:text-[16px]">{hero?.['Sub Header']}</p>
            <p className="text-[4rem] leading-tight max-xl:text-[48px] max-md:text-[36px]">{hero?.['Header']}</p>
          </div>
        </div>
        <img src={hero?.['Hero Image']} className="my-auto w-full"/>
      </div> */}
      <div className="h-[100vh] bg-black overflow-hidden">
        <img src={hero?.["Hero Image"]} className="h-[100vh] w-[100vw] opacity-60 object-cover" />
        <div className="flex flex-row min-[600px]:justify-end absolute left-0 bottom-[100px]">
          <div className="font-bold flex flex-col justify-center w-[80%] min-[600px]:mr-[20px] max-[600px]:gap-[20px] max-[600px]:px-[16px] max-[600px]:pb-[34px] max-[600px]:pt-[48px]">
            <p className="text-primary text-[1.5rem] max-xl:text-[18px] max-md:text-[16px]">
              {hero?.["Sub Header"]}
            </p>
            <p className="text-[4rem] leading-tight max-xl:text-[48px] max-md:text-[36px] text-white">
              {hero?.["Header"]}
            </p>
          </div>
        </div>
      </div>
      {/* Section 2 */}
      <HomeSectionLayout>
        <div className="mb-[100px]">
          <p className="text-[24px] max-lg:text-[18px] max-md:text-[16px] mt-[96px] mb-[80px] max-md:my-[32px] font-bold leading-[40px]">
            {talents?.Description}
          </p>
          <ImageCarousel data={talents?.talents} />
        </div>
      </HomeSectionLayout>
      <div className="primary-gradient pt-[100px]">
        <HomeSectionLayout>
          <p className="text-[45px] font-semibold text-center mb-[30px]">
            {section?.Header}
          </p>
          <HowDoesItWork data={section?.Content} />
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
