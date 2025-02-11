import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useParticipantStore from "@/store/use-participant";
import { GetAccountInformation } from "@/actions/getAccountInformation";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { DeleteApprovePicture } from "@/actions/deleteApprovePicture";
import { ApprovePicture } from "@/actions/approvePicture";
import { GetApprovePictureById } from "@/actions/getApprovePicturesById";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const Home = () => {
  const router = useRouter();
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const [data, setData] = useState<any>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        setDataLoading(true);
        const result = await GetApprovePictureById(
          router.query.id.toString()
        );
        if (result.status === false) {
          toast.error("Please check your internet connection!");
          return;
        }
        const data = result.data.data;
        console.log("data");
        console.log(data);
        if (data.fields) {
          console.log(data.fields)
          setData(data.fields["Pictures to Approve"]?.split(","));
        }
        setDataLoading(false);
      }
    })();
  }, [router.query.id]);

  const handleDelete = async (idx: number) => {
    let updatedPhotos = data?.filter((item: any, index: number) => index !== idx);

    var urls = updatedPhotos?.join(',') || '';
    setDataLoading(true);
    setData(updatedPhotos);
    await DeleteApprovePicture(router?.query?.id?.toString() || "", urls);
    if(updatedPhotos.length === 1) router.push('/dashboard/approve');
    setDataLoading(false);
  };

  const handleApprove = async (idx: number) => {
    let updatedPhotos = data?.filter((item: any, index: number) => index !== idx);

    setDataLoading(true);
    await ApprovePicture(router?.query?.id?.toString() || "", data[idx])
    setData(updatedPhotos);
    if(updatedPhotos.length <= 1) router.push('/dashboard/approve');
    setDataLoading(false);
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        {/* <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Add Job
        </p> */}
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md cursor-pointer grid xl:grid-cols-4 md:grid-cols-3 gap-2 grid-cols-2">
            {data?.map((item: any, index: number) =>
              index !== data.length - 1 ? (
                <div
                key={'approval' + index}
                  className={`p-[15px] border-[2px] rounded-lg flex flex-col gap-[20px] hover:border-[#d63384] transition relative`}
                  onClick={onOpenChange}
                >
                  <img
                    src={item}
                    className={` rounded-xl`}
                    style={{ imageRendering: "auto" }}
                  />
                  <Button color="danger" onClick={() => handleApprove(index)}>Approve</Button>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="bordered"
                    size="sm"
                    className="absolute right-[-15px] top-[-15px] z-[10] bg-white"
                    onClick={() => handleDelete(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </div>
      </div>
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
                  {data?.map((item: any, index: number) => {
                    if (index !== data?.length - 1)
                      return (
                    <div className="flex flex-col  justify-center" key={"div"+index}>
                      <div className="mx-auto">
                        <img
                          key={index}
                          className="my-auto h-[70vh] w-auto"
                          src={item}
                        />
                        </div>
                        </div>
                      );
                  })}
                </Carousel>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
};

export default Home;
