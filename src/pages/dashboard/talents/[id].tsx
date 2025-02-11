import { GetAccountInformation } from "@/actions/getAccountInformation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import {
  faFileArrowUp,
  faLink,
  faPenToSquare,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Chip, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, app } from "@/lib/firebaseclient";
import { getAuth } from 'firebase/auth';

import { UploadPhoto } from "@/actions/uploadPhoto";
import { DeletePhoto } from "@/actions/deletePhoto";
import { GetJobId } from "@/actions/getJobIds";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export default function TalentbyId() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [pictures, setPictures] = useState([]);
  const [jobs, setJobs] = useState<any>([]);
  const [clientAuth, setClientAuth] = useState<any>();
  useEffect(() => {
    (async () => {
      if (router.query.id) {
        setDataLoading(true);
        const result = await GetAccountInformation(
          router.query.id.toString(),
          "talent"
        );
        if (result.status === false) {
          toast.error("Please check your internet connection!");
          return;
        }
        const datas = result.data.data;
        console.log("data");
        console.log(datas);
        if (datas.fields) {
          setData(datas.fields);
          const pics = datas.fields?.["Pictures"]?.split(",") || [];
          setPictures(pics);
        }
        let job;
        if (datas.fields?.["BOOKINGS"]) {
          job = await GetJobId(datas.fields?.["BOOKINGS"]?.join(","));
        }
        let temp: any[] = [];
        if (job?.data) {
          job?.data?.data?.records?.map((item: any, index: number) => {
            temp.push({
              id: item.id,
              name: item.fields["Event"],
            });
          });
        }
        console.log(temp);
        setJobs(temp);
        setDataLoading(false);
      }
    })();
  }, [router.query.id]);
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
        const result = await UploadPhoto(
          router?.query?.id?.toString() || "",
          downloadURL
        );
        setData(result.data.fields);
        toast.success(
          "Your image has been successfully uploaded and is currently undergoing review. Once approved, it will be displayed on your profile. Thank you for your patience!"
        );
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
      const result = await DeletePhoto(
        router?.query?.id?.toString() || "",
        urls.join(",")
      );
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
    const avatar = url + ",";

    const value = avatar + urls.join(",");

    if (urls) {
      const result = await DeletePhoto(
        router?.query?.id?.toString() || "",
        value
      );
      if (result.status) {
        setData(result.data.fields);
        const updatedPictures: any = [url].concat(urls);
        setPictures(updatedPictures);
      } else toast.error("Internal server error!");
    }
    setDataLoading(false);
  };

  useEffect(()=>{
    const clientAuthdata = getAuth(app);
    setClientAuth(clientAuthdata);
  },[])
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
                        if (index !== pictures?.length - 1)
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
        {clientAuth && clientAuth.currentUser ? (
          <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
            {data ? data["TALENT FULL NAME"] : ""}'s Profile
          </p>
        ) : (
          <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
            {data
              ? data["TALENT FULL NAME"].split(" ")[0] +
                " " +
                data["TALENT FULL NAME"].split(" ")[1][0]
              : ""}
            's Profile
          </p>
        )}
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
              <div className="flex flex-col lg:flex-row gap-[10px] max-md:mt-[100px]  lg:gap-[30px] md:ml-[280px] p-5">
                <div className="flex flex-col gap-1 md:max-w-[230px]">
                  {clientAuth && clientAuth.currentUser ? (
                    <p className="font-bold text-[18px] max-md:text-center">
                      {data ? data["TALENT FULL NAME"] : ""}
                    </p>
                  ) : (
                    <p className="font-bold text-[18px] max-md:text-center">
                      {data
                        ? data["TALENT FULL NAME"].split(" ")[0] +
                          " " +
                          data["TALENT FULL NAME"].split(" ")[1][0]
                        : ""}
                    </p>
                  )}
                  {accountType === "booker" ? (
                    <div className="flex flex-row gap-1 max-md:mx-auto">
                      {[0, 1, 2, 3, 4].map((item: number) => (
                        <FontAwesomeIcon
                          icon={faStar}
                          key={"rating" + item}
                          className={`${
                            item < data?.["Rating"]
                              ? "text-[#ff4081]"
                              : "text-[#eee]"
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex flex-row gap-2">
                    {data?.["Type of Permit"]?.map((item: string) => (
                      <Chip size="sm" key={item}>
                        {item}
                      </Chip>
                    ))}
                    <p
                      className={`text-[14px] ${
                        new Date(data?.["Permit Expiration Date"]) < new Date()
                          ? "text-[#ff4081]"
                          : ""
                      }`}
                    >
                      {data?.["Permit Expiration Date"]}
                    </p>
                  </div>
                </div>

                {clientAuth && clientAuth.currentUser ? (
                  <div className="w-[1px] h-full opacity-80 mx-auto bg-[#0a0c12] max-lg:hidden"></div>
                ) : (
                  ""
                )}
                {clientAuth && clientAuth.currentUser ? (
                  <div className="flex flex-row max-md:justify-center">
                    <a
                      href={`mailto:${data ? data["Email"] : ""}`}
                      className="underline text-[18px] font-bold"
                    >
                      {data ? data["Email"] : ""}
                    </a>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex flex-row gap-2">
              {accountType !== "client" && accountType !== 'talent' && clientAuth &&  clientAuth.currentUser ? (
                <a
                href={`/dashboard/activities?search=${data ?data['TALENT FULL NAME'] : ''}`}
                target="_blank"
                  className="no-underline flex flex-row py-[14px] px-[28px] text-[18px] gap-2 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300"
                >
                  <FontAwesomeIcon icon={faLink} className="pt-1" />
                  Activity
                </a>
              ) : (
                ""
              )}
              {accountType !== "client" && clientAuth &&  clientAuth.currentUser ? (
                <button
                  onClick={() => router.push(`edit/${router.query.id}`)}
                  className="flex flex-row py-[14px] px-[28px] text-[18px] gap-2 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="pt-1" />
                  Edit
                </button>
              ) : (
                ""
              )}
</div>
              <div className="absolute translate-y-[-50%] bg-white lg:left-[30px] md:left-[10px] left-[50%] max-md:translate-x-[-50%]  rounded-3xl p-3 min-w-[254px] min-h-[254px]">
                <img
                  className="rounded-3xl w-[230px] h-[230px] object-cover object-top"
                  src={
                    pictures
                      ? pictures?.[0]
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
                {clientAuth && clientAuth.currentUser ? (
                  <div className="flex flex-row gap-2">
                    <label
                      htmlFor="fileinput"
                      className="py-2 px-[13px] w-[40px] h-[40px] bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl"
                    >
                      <FontAwesomeIcon icon={faFileArrowUp} size="lg" />
                    </label>
                    <input
                      type="file"
                      id="fileinput"
                      className="hidden"
                      onChange={handleUpload}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="grid grid-cols-3 gap-[10px] ">
                {data
                  ? pictures?.map((item: any, index: number) =>
                      index !== pictures?.length - 1 ? (
                        <div
                          key={index}
                          className="relative flex flex-col gap-1"
                        >
                          <img
                            key={index}
                            className="rounded-3xl object-cover object-top aspect-square"
                            src={item}
                            onClick={() => onOpenChange()}
                          />
                          {clientAuth &&  clientAuth.currentUser ? (
                            <Button
                              className="text-white text-[12px] "
                              color="danger"
                              onClick={async () =>
                                await handleSetAvatar(item, index)
                              }
                            >
                              Set as Profile Avatar
                            </Button>
                          ) : (
                            ""
                          )}
                          { clientAuth && clientAuth.currentUser ? (
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
                          ) : (
                            ""
                          )}
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
                {accountType !== "client" && clientAuth &&  clientAuth.currentUser ? (
                  <button
                    onClick={() => router.push("/dashboard/profile/edit")}
                    className="flex flex-row py-[14px] px-[28px] text-[18px] gap-2 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="pt-1" />
                    Edit
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div className="grid max-[1600px]:grid-cols-1 grid-cols-2 gap-[20px]">
                <div className="flex flex-col gap-[20px]">
                  <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                    <p className="text-[#ff4081] text-[18px] font-bold">
                      Basic Information
                    </p>
                    {clientAuth && clientAuth.currentUser ? (
                      <Information
                        label="Name:"
                        data={data ? data["TALENT FULL NAME"] : ""}
                      />
                    ) : (
                      <Information
                        label="Name:"
                        data={
                          data
                            ? data["TALENT FULL NAME"].split(" ")[0] +
                              " " +
                              data["TALENT FULL NAME"].split(" ")[1][0]
                            : ""
                        }
                      />
                    )}

                    {clientAuth && clientAuth.currentUser ? (
                      <Information
                        label="Street Address:"
                        data={data ? data["Street Address 1"] : ""}
                      />
                    ) : (
                      ""
                    )}
                    <Information
                      label="City:"
                      data={data ? data["City"] : ""}
                    />
                    <Information
                      label="State:"
                      data={data ? data["State"] : ""}
                    />
                    {clientAuth && clientAuth.currentUser ? (
                      <Information
                        label="Zip:"
                        data={data ? data["Zip"] : ""}
                      />
                    ) : (
                      ""
                    )}
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
                  {clientAuth && clientAuth.currentUser ? (
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
                  ) : (
                    ""
                  )}
                  {clientAuth && clientAuth.currentUser ? (
                    <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                      <p className="text-[#ff4081] text-[18px] font-bold">
                        Talent's Job List
                      </p>
                      {jobs.map((value: any, index: any) => (
                        <a
                          key={`job-book-talent-${index}`}
                          href={`${process.env.NEXT_PUBLIC_SERVER_URI}/job-board/${value.id}`}
                          className="flex"
                          target="blank"
                        >
                          {value.name}
                        </a>
                      ))}
                      <a></a>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
