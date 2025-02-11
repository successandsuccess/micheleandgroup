import Image from "next/image";
import { Inter } from "next/font/google";
import HomeSectionLayout from "@/components/layouts/home-section";
import BusinessCard from "@/components/BusinessCard";
import Footer from "@/components/Footer";
import Paragraph from "@/components/Paragraph";
import ImageCard from "@/components/ImageCard";
import TextInput from "@/components/TextInput";
import CardLayout from "@/components/layouts/CardLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faInfo,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { FooterIcon } from "@/components/Footer/icon";
import useParticipantStore from "@/store/use-participant";
import { useEffect, useState } from "react";
import { GetEmail } from "@/actions/page/getEmail";
import { GetStaff } from "@/actions/page/getStaff";
import { GetHelp } from "@/actions/page/getHelp";
import { GetOffice } from "@/actions/page/getOffice";
const inter = Inter({ subsets: ["latin"] });

export default function Contact() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const [emailUs, setEmailUs] = useState<Array<any>>([]);

  const [staff, setStaff] = useState<Array<any>>([]);

  const [help, setHelp] = useState<Array<any>>([]);

  const [office, setOffice] = useState<any>();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      setDataLoading(true);

      const email_record = await GetEmail();
      const email_data = await JSON.parse(
        email_record?.data?.data?.fields?.Data
      );
      console.log(email_record);
      setEmailUs(email_data);

      const staff_record = await GetStaff();
      const staff_data = await JSON.parse(
        staff_record?.data?.data?.fields?.Data
      );
      setStaff(staff_data);

      const help_record = await GetHelp();
      const help_data = await JSON.parse(help_record?.data?.data?.fields?.Data);
      setHelp(help_data);

      const office_record = await GetOffice();
      const office_data = await JSON.parse(
        office_record?.data?.data?.fields?.Data
      );

      setOffice(office_data);

      setDataLoading(false);
    })();
  }, []);

  return (
    <main className={`min-h-screen pt-[50px]`}>
      {/* Section 1 */}
      <HomeSectionLayout>
        <p className="text-center font-bold mb-[30px] text-[40px]">Contact</p>
        <div className="contact-section ">
          <div className="max-md:h-[1600px]">
            <iframe
              // class="airtable-embed"
              src="https://airtable.com/embed/appkUNKjlCJaZm4Ry/pagoIP7kWVvwLAHZy/form"
              // frameborder="0"
              // onmousewheel=""
              width="100%"
              height="100%"
              // style="background: transparent; border: 1px solid #ccc;"
            ></iframe>
          </div>
          {/* <div
            className="p-5 border-[1px] border-gray-200 rounded-2xl"
            style={{ height: "max-content" }}
          >
            <p className="font-bold text-center mb-10">
              To book talent for your upcoming project, please fill out the form
              below and one of our bookers will contact you.
            </p>
            <div className="p-10 rounded-2xl bg-gray-100 flex flex-col gap-5">
            
              <TextInput
                type="text"
                id="Subject"
                name="Subject"
                label="Your Subject"
                value={subject}
                setValue={setSubject}
              />
              <div>
                <label>Your Message (required)</label>
                <textarea
                  className="py-[6px] px-[12px] h-[254px] outline-primary w-full border-[1px] border-gray-200 resize-none"
                  id="Message"
                  name="Message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <a href={`mailto:help@micheleandgroup.com?subject=${subject}&body=${message}`}>
              <button
                className="w-[85px] py-2 px-5 text-white font-bold mt-[14px] bg-primary rounded-lg hover:bg-primarylight trnasition duration-300"
                type="submit"
              >
                Send
              </button>
              </a>
            </div>
          </div> */}
          <div className="flex flex-col gap-5">
            <CardLayout>
              <div className="flex flex-col gap-5">
                <div className="font-bold text-[16px] ">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-primary"
                    size="lg"
                  />{" "}
                  Email Us
                </div>
                <hr />
                {emailUs?.map((item: any, index: number) => (
                  <div key={"emailus" + index} className="flex flex-col gap-5">
                    <a
                      href={`mailto:${item.Email}`}
                      className="hover:underline"
                    >
                      {item.Name}
                    </a>
                    <hr />
                  </div>
                ))}
              </div>
            </CardLayout>
            <CardLayout>
              <div className="flex flex-col gap-5">
                <div className="font-bold text-[16px] flex flex-row gap-2">
                  <img src="/assets/icons/building-solid.svg" className="w-4" />{" "}
                  CORPORATE OFFICE
                </div>
                <hr />
                <div className="text-[16px] flex flex-row gap-2">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-primary mt-1"
                    size="sm"
                  />{" "}
                  <p>{office?.Phone}</p>
                </div>
                <hr />
                <div className="text-[16px] flex flex-row gap-2">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-primary mt-1"
                    size="lg"
                  />{" "}
                  <p>{office?.Location}</p>
                </div>
                <hr />
                <p className="italic">*Office Hours are by Appointment Only</p>
              </div>
            </CardLayout>
            <CardLayout>
              <div className="flex flex-col gap-5">
                <div className="font-bold text-[16px] ">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-primary"
                    size="lg"
                  />{" "}
                  STAFF
                </div>
                <hr />
                {staff?.map((item: any, index: number) => (
                  <div key={"staff" + index} className="flex flex-col gap-5">
                    <a
                      href={`mailto:${item.Email}`}
                      className="hover:underline"
                    >
                      {item.Name}
                    </a>
                    <hr />
                  </div>
                ))}
              </div>
            </CardLayout>
            <CardLayout>
              <div className="flex flex-col font-bold gap-5">
                <div className="font-bold text-[16px] ">
                  <FontAwesomeIcon
                    icon={faInfo}
                    className="text-primary"
                    size="lg"
                  />{" "}
                  HELPFUL LINKS
                </div>
                <hr />
                {help?.map((item: any, index: number) => (
                  <div key={"help" + index} className="flex flex-col gap-5">
                    <a href={`${item.Email}`} className="hover:underline">
                      {item.Name}
                    </a>
                    <hr />
                  </div>
                ))}
              </div>
            </CardLayout>
            <CardLayout>
              <div className="flex flex-col gap-5">
                <div className="font-bold text-[16px] ">
                  <FontAwesomeIcon
                    icon={faInfo}
                    className="text-primary"
                    size="lg"
                  />{" "}
                  SOCIALS
                </div>
                <hr />
                <div className="flex flex-row justify-center gap-6">
                  <FooterIcon
                    src="/assets/icons/fb.svg"
                    href="https://www.facebook.com/Micheleandgroup"
                    color="#3b5998"
                  />
                  <FooterIcon
                    src="/assets/icons/insta.svg"
                    href="https://instagram.com/micheleandgroup/"
                  />
                  <FooterIcon
                    src="/assets/icons/twitter.svg"
                    href="https://twitter.com/micheleandgroup"
                    color="#03a9f4"
                  />
                </div>
              </div>
            </CardLayout>
          </div>
        </div>
      </HomeSectionLayout>
      <Footer />
      <p className="text-center bg-[#eeeeee] text-[#212121] text-[14px] py-[11px]">
        Copyright 2023 Michele & Group, Inc., All Rights Reserved | State
        License #TA0000236
      </p>
    </main>
  );
}
