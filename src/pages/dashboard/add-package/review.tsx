import { StepsLayout } from "@/components/Steps/package/StepsLayout";
import Sidebar from "@/components/Sidebar";
import usePackageStore from "@/store/use-package";
import useParticipantStore from "@/store/use-participant";
import { useEffect } from "react";
import Link from "next/link";
import { Avatar, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { clientAuth } from "@/lib/firebaseclient";
import parse from "html-react-parser";
import { NavigationButtons } from "@/components/Steps/package/NavigationButtons";

const YourAnswers = () => {
  const {
    talentInvited,
    setTalentInvited,
    setMessage,
    name,
    email,
    subject,
    message,
    availableTalent,
  } = usePackageStore((state) => state);
  const { airtable_id, setDataLoading, loading } = useParticipantStore(
    (state) => state
  );

  useEffect(() => {
    (async () => {
      var msg = message;
      msg = msg.replaceAll(
        "{$booker_name}",
        clientAuth.currentUser?.displayName || ""
      );
      msg = msg.replaceAll("{$name}", name);
      setMessage(msg);
      if (airtable_id && loading === true) {
        setDataLoading(false);
      }
    })();
  }, [airtable_id, loading]);

  const handleDelete = (idx: number) => {
    const updated = talentInvited?.filter(
      (item: any, index: number) => index !== idx
    );
    setTalentInvited(updated);
  };

  const handleAvailable = () => {
    console.log("availableTalent", availableTalent)
    setTalentInvited(availableTalent);
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Add Package
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <StepsLayout>
              <div className="flex flex-col gap-5 md:min-w-[500px] min-w-80 overflow-y-auto min-h-[200px] px-5">
                <div className="p-3 border-1">
                  <p>Client Name</p>
                  <p className="font-bold">{name}</p>
                </div>
                <div className="p-3 border-1">
                  <p>Client Email</p>
                  <p className="font-bold">{email}</p>
                </div>
                {subject ? (
                  <div className="p-3 border-1">
                    <p>Subject</p>
                    <p className="font-bold">{subject}</p>
                  </div>
                ) : (
                  ""
                )}

                <div className="flex flex-col">
                  {talentInvited.map((item: any, index) => (
                    <div className="flex flex-row gap-5">
                      <Link
                        key={index}
                        href={`/dashboard/talents/${item.id}`}
                        target="_blank"
                        className="flex flex-row gap-2 min-w-52"
                      >
                        <Avatar src={item.url} name={item.name} />
                        <p className="my-auto">{item.name}</p>
                      </Link>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="bordered"
                        size="sm"
                        className="bg-white"
                        onClick={() => handleDelete(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button color="primary" className="md:w-52 ml-auto" onClick={() => handleAvailable()}>
                  Select Available Talent
                </Button>
              </div>
              <NavigationButtons
                back="/dashboard/add-package/step-two"
                next="submit"
                home
              />
            </StepsLayout>
          </div>
        </div>
      </div>
    </main>
  );
};

export default YourAnswers;
