import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dot } from "./icons/Dot";
import { HorizontalLine } from "./icons/HorizontalLine";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFileInvoice, faUserPlus } from "@fortawesome/free-solid-svg-icons";

type StepTitleProps = {
  active: boolean;
  title: string;
};

type StepsLayoutProps = {
  children: ReactNode;
};

export const StepTitle = ({ active, title }: StepTitleProps) => {
  return (
    <h2
      className={`text-md max-md:hidden lg:text-xl ${
        active
          ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
          : "text-gray-700"
      }`}
    >
      {title}
    </h2>
  );
};

export const StepsLayout = ({ children }: StepsLayoutProps) => {
  const router = useRouter();

  const activeOne = router.pathname === "/dashboard/add-package/";
  const activeTwo = router.pathname === "/dashboard/add-package/step-two";
  const activeAnswers = router.pathname === "/dashboard/add-package/review";

  return (
    <article className="flex flex-col gap-5 lg:min-w-[82%]">
      <div className="flex flex-row gap-2 justify-between md:px-8 py-6 md:mx-20 border-b-2 border-[#8586887c] border-dashed">
        <Link href="/dashboard/add-package/" className="!no-underline">
          <div className="flex items-center sm:gap-4 gap-1 md:min-w-[100px] min-w-[50px]">
            {/* <Dot active /> */}
            <FontAwesomeIcon icon={faFileInvoice} className={`text-sky-500 mx-auto`} />
            <StepTitle active={true} title="Detail" />
          </div>
        </Link>
        <HorizontalLine active={activeTwo || activeAnswers} />
        <Link href="/dashboard/add-package/step-two" className="!no-underline">
          <div className="flex items-center sm:gap-4 gap-1 md:min-w-[100px] min-w-[50px]">
            {/* <Dot active={activeTwo || activeAnswers} /> */}
            <FontAwesomeIcon icon={faUserPlus} className={`${activeTwo || activeAnswers ? "text-sky-500 mx-auto" : "text-black mx-auto"}`}/>
            <StepTitle active={activeTwo || activeAnswers} title="Talent" />
          </div>
        </Link>
        <HorizontalLine active={activeAnswers} />
        <Link href="/dashboard/add-package/review" className="!no-underline">
          <div className="flex items-center sm:gap-4 gap-1 md:min-w-[100px] min-w-[50px]">
            {/*  <Dot active={activeAnswers} /> */}
            <FontAwesomeIcon icon={faEye} className={`${activeAnswers ? "text-sky-500 mx-auto" : "text-black mx-auto"}`}/>
            <StepTitle active={activeAnswers} title="Review" />
          </div>
        </Link>
      </div>
      <div>{children}</div>
    </article>
  );
};
