import { GetAccountInformation } from "@/actions/getAccountInformation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import {
  faFileArrowUp,
  faPenToSquare,
  faPlay,
  faTrash,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { BasicInfoItem } from "../../../components/BasicInfoItem";
import { Information } from "../../../components/Information";
import { useRouter } from "next/router";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/lib/firebaseclient";
import { UploadPhoto } from "@/actions/uploadPhoto";
import { DeletePhoto } from "@/actions/deletePhoto";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export default function Profile() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const result = await GetAccountInformation(airtable_id, accountType);
        if (result.status === false) {
          toast.error("Please check your internet connection!");
          return;
        }
        const data = result.data.data;
        console.log(result);
        const pics = data.fields?.["Pictures"]?.split(",") || [];
        setPictures(pics);
        // console.log(data.fields["Pictures"]);
        if (data.fields) {
          setData(data.fields);
        }
        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setDataLoading(true);
    const uuid = uuidv4();
    const storageRef = ref(storage, uuid + ".jpg");
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: any) => {},
      (error) => {
        setDataLoading(false);
        toast.error("Upload failed!");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const result = await UploadPhoto(airtable_id, downloadURL);
        setData(result.data.fields);
        toast.success("Your image has been successfully uploaded and is currently undergoing review. Once approved, it will be displayed on your profile. Thank you for your patience!");
        setDataLoading(false);
      }
    );
  };

  const handleDelete = async (selected: number) => {
    setDataLoading(true);
    const urls = pictures?.filter(
      (item: any, index: number) => index !== selected
    );
    if (urls) {
      const result = await DeletePhoto(airtable_id, urls.join(','));
      if (result.status) {
        setData(result.data.fields);
        setPictures(urls);
      } else toast.error("Internal server error!");
    }
    setDataLoading(false);
  };

  const handleSetAvatar = async (url: string, selected: number) => {
    setDataLoading(true);
    const urls = pictures?.filter(
      (item: any, index: number) => index !== selected
    );
    const avatar = url + ',';

    const value = avatar + urls.join(',');

    if (urls) {
      const result = await DeletePhoto(airtable_id || '', value);
      if (result.status) {
        setData(result.data.fields);
        const updatedPictures:any = [url].concat(urls);
        setPictures(updatedPictures);
      } else toast.error("Internal server error!");
    }
    setDataLoading(false);
  }

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        size="4xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <Carousel
                  responsive={responsive}
                  infinite={true}
                  autoPlaySpeed={5000}
                  autoPlay={true}
                  transitionDuration={500}
                >
                  {data
                    ? pictures?.map((item: any, index: number) => {
                        if (index !== pictures.length - 1)
                          return (
                            <div
                            className="flex flex-col  justify-center"
                            key={"div" + index}
                          >
                            <div className="mx-auto">
                              <img
                                key={index}
                                className="my-auto h-[70vh] w-auto"
                                src={item}
                              />
                            </div>
                          </div>
                            // <img
                            //   key={index}
                            //   className="mx-auto my-auto object-cover object-top aspect-square"
                            //   src={item}
                            // />
                          );
                      })
                    : ""}
                </Carousel>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          {data ? data["TALENT FULL NAME"] : ""}'s Profile
        </p>
        <div className="flex flex-col gap-[30px]">
          {/* Section1 */}
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <div className="bg-primary  rounded-2xl overflow-hidden">
              <img
                src="/assets/images/profile-banner.png"
                className="w-full opacity-30 h-[230px] object-cover"
              />
            </div>
            <div className="flex max-md:flex-col justify-between mb-[25px] relative">
              <div className="flex flex-col lg:flex-row gap-[10px] max-md:mt-[100px] lg:gap-[30px] md:ml-[280px] p-5">
                <p className="font-bold text-[18px] max-md:text-center">
                  {data ? data["TALENT FULL NAME"] : ""}
                </p>
                <div className="w-[1px] h-[40px] opacity-80 mx-auto bg-[#0a0c12] max-lg:hidden"></div>
                <div className="flex flex-row max-md:justify-center">
                  <a
                    href={`mailto:${data ? data["Email"] : ""}`}
                    className="underline text-[18px] font-bold"
                  >
                    {data ? data["Email"] : ""}
                  </a>
                </div>
              </div>
              <button
                onClick={() => router.push("/dashboard/profile/edit")}
                className="flex flex-row py-[14px] px-[28px] text-[18px] gap-2 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300"
              >
                <FontAwesomeIcon icon={faPenToSquare} className="pt-1" />
                Edit
              </button>
              <div className="absolute translate-y-[-50%] bg-white lg:left-[30px] md:left-[10px] left-[50%] max-md:translate-x-[-50%]  rounded-3xl p-3 min-w-[254px] min-h-[254px] ">
                <img
                  className="rounded-3xl w-[230px] h-[230px] object-top object-cover"
                  src={
                    data
                      ? pictures?.[0] ||
                        "/assets/images/Placeholder_view_vector.svg"
                      : "/assets/images/Placeholder_view_vector.svg"
                  }
                />
              </div>
            </div>
          </div>
          {/* Section 2 */}
          <div className="grid profile-section grid-cols-1 gap-[30px]">
            <div
              className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md "
              style={{ height: "max-content" }}
            >
              <div className="flex flex-row justify-between">
                <p className="text-[24px] font-bold mb-[10px]">Talent Images</p>
                <div className="flex flex-row gap-2">
                  <label
                    htmlFor="fileinput"
                    className="py-2 px-[13px] w-[40px] h-[40px] bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl"
                  >
                    <FontAwesomeIcon icon={faFileArrowUp} size="lg" />
                  </label>
                  <button
                    className="py-2 px-[14px] w-[40px] h-[40px] bg-[#ff4081] text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl"
                    onClick={() => onOpenChange()}
                  >
                    <FontAwesomeIcon icon={faPlay} size="lg" />
                  </button>
                </div>
                <input
                  type="file"
                  id="fileinput"
                  className="hidden"
                  onChange={handleUpload}
                />
              </div>
              <div className="grid grid-cols-3 gap-[10px]">
                {data
                  ? pictures?.map((item: any, index: number) =>
                      index !== pictures.length - 1 ? (
                        <div key={index} className="relative">
                          <img
                            key={index}
                            className="rounded-3xl object-cover object-top aspect-square"
                            src={item}
                          />
                           {/* <Button className="text-white text-[12px] " color="danger" onClick={async () => await handleSetAvatar(item, index)}>
                            Set as Profile Avatar
                          </Button> */}
                          <Button
                            isIconOnly
                            color="danger"
                            variant="bordered"
                            size="sm"
                            className="absolute right-[-15px] top-0 z-[10] bg-white"
                            onClick={() => handleDelete(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      ) : (
                        ""
                      )
                    )
                  : ""}
              </div>
            </div>
            <div className="flex flex-col gap-[10px] rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
              <div className="flex flex-row justify-between">
                <p className="text-[24px] font-bold mb-[10px] my-auto">
                  Personal Information
                </p>
                <button
                  onClick={() => router.push("/dashboard/profile/edit")}
                  className="flex flex-row py-[14px] px-[28px] text-[18px] gap-2 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="pt-1" />
                  Edit
                </button>
              </div>
              <div className="grid max-[1600px]:grid-cols-1 grid-cols-2 gap-[20px]">
                <div className="flex flex-col gap-[20px]">
                  <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                    <p className="text-[#ff4081] text-[18px] font-bold">
                      Basic Information
                    </p>
                    <Information
                      label="Name:"
                      data={data ? data["TALENT FULL NAME"] : ""}
                    />
                    <Information
                      label="Street Address:"
                      data={data ? data["Street Address 1"] : ""}
                    />
                    <Information
                      label="City:"
                      data={data ? data["City"] : ""}
                    />
                    <Information
                      label="State:"
                      data={data ? data["State"] : ""}
                    />
                    <Information label="Zip:" data={data ? data["Zip"] : ""} />
                    <Information
                      label="Age:"
                      data={`${data ? data["AGE"] : ""} years old`}
                    />
                    <Information
                      label="Gender:"
                      data={data ? data["Gender"] : ""}
                    />
                    {/* <Information label="Type:" data={data['TALENT TYPE [internal]']} /> */}
                  </div>
                  <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                    <p className="text-[#ff4081] text-[18px] font-bold">
                      Dimensions
                    </p>
                    <Information
                      label="Height:"
                      data={data ? data["Height"] : ""}
                    />
                    <Information
                      label="Waist:"
                      data={data ? data["Waist"] : ""}
                    />
                    <Information
                      label="Hips:"
                      data={data ? data["Hips"] : ""}
                    />
                    <Information
                      label="Bust:"
                      data={data ? data["Bust"] : ""}
                    />
                    <Information
                      label="Shoe Size:"
                      data={data ? data["Shoe Size"] : ""}
                    />
                    <Information
                      label="Dress Size:"
                      data={data ? data["Dress Size"] : ""}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[20px]">
                  <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                    <p className="text-[#ff4081] text-[18px] font-bold">
                      Attributes
                    </p>
                    <Information
                      label="Hair Color:"
                      data={data ? data["Hair Color"] : ""}
                    />
                    <Information
                      label="Eye Color:"
                      data={data ? data["Eye Color"] : ""}
                    />
                    <Information
                      label="Languages:"
                      data={data ? data["Languages"]?.join(", ") : ""}
                    />
                    <Information
                      label="Ethnicity:"
                      data={data ? data["Ethnicity"] : ""}
                    />
                  </div>
                  <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                    <p className="text-[#ff4081] text-[18px] font-bold">
                      Contact Information
                    </p>
                    <Information
                      label="Cell Phone:"
                      data={data ? data["Cell Phone"] : ""}
                    />
                    <a href={`mailto:${data ? data["Email"] : ""}`}>
                      <Information
                        label="Email:"
                        data={data ? data["Email"] : ""}
                        underline={true}
                        flexwrap={true}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
