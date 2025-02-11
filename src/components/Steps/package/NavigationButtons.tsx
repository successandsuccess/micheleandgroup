import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useParticipantStore from "@/store/use-participant";
import { SendPackage } from "@/actions/sendPackage";
import usePackageStore from "@/store/use-package";
import { toast } from "react-toastify";
import { clientAuth } from "@/lib/firebaseclient";
import { useSearchParams } from "next/navigation";

type NavigationButtonsProps = {
  back: string;
  next: string;
  home?: boolean;
};

export const NavigationButtons = ({
  back,
  next,
  home,
}: NavigationButtonsProps) => {
  // const {
  // } = useJobState((state) => state);

  const { name, email, subject, message, talentInvited, setMessage, setEmail, setName, setSubject, setTalentInvited, url, setPreviousUrl } =
    usePackageStore((state) => state);

  const { setDataLoading } = useParticipantStore((state) => state);

  const { setJobErrorShown } = useParticipantStore((state) => state);

  const { airtable_id } = useParticipantStore((state) => state);

  const router = useRouter();
  const { asPath } = useRouter();
  const handleNext = async () => {
    setJobErrorShown(true);
    if (next === "/dashboard/add-package/step-two") router.push(next);
    if (next === "/dashboard/add-package/review") router.push(next);
    if (next === "submit") {
      setDataLoading(true);
      await SendPackage(
        name,
        email,
        message,
        talentInvited,
        clientAuth.currentUser?.displayName || "",
        clientAuth?.currentUser?.email || "",
        subject
      );
      setMessage(
        "<p>{$name}</p><p>{$booker_name} has sent you a talent package for your review. You may view it by visiting the following URL:</p><p>Thanks!</p>"
      );
      setTalentInvited([]);
      setName('');
      setEmail('');
      setSubject('');
      toast.success("Package has been sent successfully!");
      setDataLoading(false);
      const previousUrl = url;
      setPreviousUrl('/dashboard/');
      router.push(previousUrl);
    }
  };

  useEffect(() => {
    if (asPath === "/dashboard/add-package/step-two") {
      setJobErrorShown(true);
    }
    // if (asPath === "/dashboard/add-package/step-two") {
    //   router.push("/dashboard/add-package/");
    //   window.scrollTo(0, 0);
    //   return;
    // }
    // if (asPath === "/dashboard/jobs/add/review" && talentInvited.length === 0) {
    //   router.push("/dashboard/jobs/add/step-two");
    //   return;
    // }
  }, [asPath]);

  return (
    <div className="mt-[20px] flex justify-between">
      <Link href={back}>
        <button className="py-[15px] px-[26px] text-[16px] lg:text-[16px] transition rounded-r-full rounded-l-full border-[2px] hover:border-[#ff4081] font-bold hover:text-white hover:bg-[#ff4081]">
          Back
        </button>
      </Link>
      <button
        onClick={handleNext}
        className="py-[15px] px-[26px] text-[16px] lg:text-[16px] transition rounded-r-full rounded-l-full border-[2px] hover:border-primary font-bold hover:text-white hover:bg-primary"
      >
        {home ? "Submit" : "Next"}
      </button>
    </div>
  );
};
