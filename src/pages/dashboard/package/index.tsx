import { GetTalents } from "@/actions/getTalents";
import SearchCard from "@/components/SearchCard";
import Sidebar from "@/components/Sidebar";
import { clientAuth } from "@/lib/firebaseclient";
import useParticipantStore from "@/store/use-participant";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { accountType, setDataLoading } = useParticipantStore((state) => state);
  const searchParams = useSearchParams();
  const packages = searchParams.get("talents");
  const subject = searchParams.get("subject");
  const booker = searchParams.get("booker");
  const [talents, setTalents] = useState<any>();

  const [selectedTalent, setSelectedTalent] = useState<any>(0);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    (async () => {
      if (packages) {
        setDataLoading(true);
        const data = await GetTalents(packages);
        console.log(data);
        setTalents(data?.data?.data?.records);
        setDataLoading(false);
      }
    })();
  }, [packages]);

  const handleSelect = (index: number) => {
    setSelectedTalent(index);
    onOpenChange();
  };
  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Packages
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md flex flex-col gap-5">
            {subject ? (
              <div className="p-3 border-1">
                <p>Subject</p>
                <p className="font-bold">{subject}</p>
              </div>
            ) : (
              ""
            )}
            <div className="p-3 border-1">
              <p>Booker</p>
              <p className="font-bold">{booker}</p>
            </div>
            <p className="font-bold">Talent</p>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {talents?.map((item: any, index: number) => (
                <div>
                  <SearchCard
                    disabled
                    src={
                      item.fields.Pictures
                        ? item.fields.Pictures?.split(",")?.[0]
                        : ""
                    }
                    name={
                      clientAuth.currentUser
                        ? item.fields["TALENT FULL NAME"]
                        : item.fields["TALENT FULL NAME"].split(" ")[0] +
                          " " +
                          item.fields["TALENT FULL NAME"].split(" ")[1][0]
                    }
                    location={item.fields?.['City'] + ', ' + item.fields?.['State']}
                    key={index}
                    index={index}
                    id={item.id}
                    onClick={handleSelect}
                    rating={item.fields.Rating}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {talents?.[selectedTalent]?.fields?.["TALENT FULL NAME"]}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-2">
                    <p className="font-bold w-[20%]">Location</p>
                    <p>
                      {talents?.[selectedTalent]?.fields?.["City"]},
                      {talents?.[selectedTalent]?.fields?.["State"]}
                    </p>
                  </div>
                  <div
                    className={`flex flex-row gap-2 ${
                      talents?.[selectedTalent]?.fields?.["Height"]
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <p className="font-bold w-[20%]">Height</p>
                    <p>{talents?.[selectedTalent]?.fields?.["Height"]}</p>
                  </div>
                  <div
                    className={`flex flex-row gap-2 ${
                      talents?.[selectedTalent]?.fields?.["Ethnicity"]
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <p className="font-bold w-[20%]">Ethnicity</p>
                    <p>{talents?.[selectedTalent]?.fields?.["Ethnicity"]}</p>
                  </div>
                  {talents?.[selectedTalent]?.fields?.["Gender"] === "Male" ? (
                    <div
                      className={`flex flex-row gap-2 ${
                        talents?.[selectedTalent]?.fields?.["Suit"]
                          ? ""
                          : "hidden"
                      }`}
                    >
                      <p className="font-bold w-[20%]">Suit Size</p>
                      <p>{talents?.[selectedTalent]?.fields?.["Suit"]}</p>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-row gap-2 ${
                        talents?.[selectedTalent]?.fields?.["Dress Size"]
                          ? ""
                          : "hidden"
                      }`}
                    >
                      <p className="font-bold w-[20%]">Suit Size</p>
                      <p>{talents?.[selectedTalent]?.fields?.["Dress Size"]}</p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
