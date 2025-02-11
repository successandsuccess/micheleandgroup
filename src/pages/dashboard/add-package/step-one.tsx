import { StepsLayout } from "@/components/Steps/package/StepsLayout";
import { Step } from "@/components/Steps/package/Step";
import { Input } from "@nextui-org/react";
import dynamic from "next/dynamic";
import usePackageStore from "@/store/use-package";
import useParticipantStore from "@/store/use-participant";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GetTalents } from "@/actions/getTalents";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
});

const StepOne = () => {
  const {
    name,
    email,
    subject,
    message,
    availableTalent,
    setEmail,
    setSubject,
    setMessage,
    setName,
    setTalentInvited,
    setPreviousUrl,
    setAvailableTalent,
  } = usePackageStore((state) => state);

  const { airtable_id, setDataLoading, loading } = useParticipantStore(
    (state) => state
  );

  const searchParams = useSearchParams();
  const packages = searchParams.get("talents");
  const job_id = searchParams.get('id');

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        if(job_id) {
          setPreviousUrl(`/job-board/${job_id}`);
        }
        setMessage(
          "<p>{$name}</p><p>{$booker_name} has sent you a talent package for your review. You may view it by visiting the following URL:</p><p>Thanks!</p>"
        );
        if (packages) {
          console.log('hello!');
          const data = await GetTalents(packages || "");
          console.log(data);
          console.log("available",data.data.available);
          // setTalents(data?.data?.data?.records);
          const temp: any = [];
          data?.data?.data?.records?.map((item: any, index: number) => {
            temp.push({
              id: item.id,
              name: item.fields["TALENT FULL NAME"],
              url: item.fields?.Pictures?.split(",")?.[0] || "",
            });
          });
          setTalentInvited(temp);
          const tempAvailable: any = [];
          data?.data?.data?.records?.map((item: any, index: number) => {
            if(item.fields["JOB AVAILABLE FOR"]?.some((value : any)  => value === job_id )){
              tempAvailable.push({
                id: item.id,
                name: item.fields["TALENT FULL NAME"],
                url: item?.fields?.Pictures?.[0]?.url || "",
              });
            }
          });
          console.log("tempAvailable",tempAvailable, data)
          setAvailableTalent(tempAvailable);
        }
      }
    })();
  }, [airtable_id, packages, job_id]);

  useEffect(() => {
    if(loading === true) {
      setDataLoading(false);
    }
  }, [loading])

  useEffect(() => {
    console.log(message);
  }, [message])

  return (
    <StepsLayout>
      <Step back="/dashboard/" next="/dashboard/add-package/step-two">
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Client Name"
            isRequired
            size="sm"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Client Email"
            isRequired
            size="sm"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Email Subject"
            size="sm"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          />
          <div className="border-[2px] rounded-lg py-1 overflow-hidden">
            <QuillNoSSRWrapper
              className={`w-full bg-white h-[200px] mb-[40px] `}
              theme="snow"
              value={message}
              key={"package-message"}
              onChange={setMessage}
            />
          </div>
        </div>
      </Step>
    </StepsLayout>
  );
};

export default StepOne;
