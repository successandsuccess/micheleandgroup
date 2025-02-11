import Image from "next/image";
import { Inter } from "next/font/google";
import HomeSectionLayout from "@/components/layouts/home-section";
import BusinessCard from "@/components/BusinessCard";
import Footer from "@/components/Footer";
import Paragraph from "@/components/Paragraph";
import ImageCard from "@/components/ImageCard";
import useParticipantStore from "@/store/use-participant";
import { useEffect, useState } from "react";
import { GetAbout } from "@/actions/page/getAbout";
import parse from "html-react-parser";
import { Avatar } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export default function AboutUs() {
  const { setDataLoading } = useParticipantStore((state) => state);

  const [content, setContent] = useState<any>();

  useEffect(() => {
    (async () => {
      setDataLoading(true);
      const data = await GetAbout();
      const about_data = await JSON.parse(data.data.data.fields.Data);
      setContent(about_data);
      setDataLoading(false);
    })();
  }, []);
  return (
    <main className={`min-h-screen primary-gradient pt-[50px]`}>
      {/* Section 1 */}
      <HomeSectionLayout>
        <div>
          <p className="text-center font-bold mb-[30px] text-[40px]">
            About Us
          </p>
          <div className="mb-5">{parse(content?.Description || "")}</div>
          <p className="font-bold text-[40px] text-center mt-[100px]"> Team</p>
          <div className="grid grid-cols-2 gap-[30px] max-sm:grid-cols-1 my-[40px]">
            {content?.Staffs?.map((item: any, index: number) => (
              <div
                key={"staffs" + index}
                className="flex flex-col gap-5 bg-white shadow border-primary border-[1px] rounded-xl p-5"
              >
                <div className="flex flex-row gap-5 border-b-1 pb-3">
                  <Avatar src={item.image} className="w-20 h-20 text-large" />
                  <p className="text-[20px] font-bold my-auto">{item.name}</p>
                </div>
                <p className="text-[18px]">{item.description}</p>
              </div>
            ))}
          </div>
          {/* <p className="font-bold text-[18px] mt-[150px] mb-[50px] max-md:mt-[50px] max-md:mb-[0px] max-md:text-[16px]">
            If you would like our agency to provide you with talent for your
            specific advertising campaign or promotional event,{" "}
            <span className="text-primary">call 386-676-1702.</span>
          </p> */}
          <Paragraph
            description="Check out just a few of our featured clients below!"
            bold
          />
        </div>
        <div className="grid grid-cols-3 gap-[30px] max-lg:grid-cols-2 max-sm:grid-cols-1 ">
          {content?.Brands?.map((item: any, index: number) => (
            <ImageCard src={item} key={"brands" + index} />
          ))}
        </div>

        <BusinessCard />
      </HomeSectionLayout>
      <Footer />
      <p className="text-center bg-[#eeeeee] text-[#212121] text-[14px] py-[11px]">
        Copyright 2023 Michele & Group, Inc., All Rights Reserved | State
        License #TA0000236
      </p>
    </main>
  );
}
