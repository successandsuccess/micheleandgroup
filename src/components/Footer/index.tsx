import Link from "next/link";
import { HeaderItem } from "../Header/item";
import HomeSectionLayout from "../layouts/home-section";
import { FooterIcon } from "./icon";

const Footer = () => {
  return (
    <HomeSectionLayout>
      <div className="flex flex-row justify-center gap-[100px] max-xl:gap-[80px] max-lg:gap-[50px] max-md:gap-[40px] mb-[30px] max-md:hidden">
        <HeaderItem href="/" text="Home" />
        <HeaderItem href="/about-us" text="About Us" />
        <Link href="/">
          <img
            src="/assets/images/logo.png"
            width={294}
            height={56}
            alt="Footer-Logo"
          />
        </Link>
        <HeaderItem href="/female-models" text="Talent" />
        <HeaderItem href="/contact" text="Contact" />
      </div>
      <div className="flex flex-col gap-[20px] mb-[30px] min-[768px]:hidden">
        <Link href="/">
          <img
            src="/assets/images/logo.png"
            width={294}
            height={56}
            className="mx-auto"
            alt="Footer-Logo"
          />
        </Link>
        <div className="flex flex-row justify-between">
          <HeaderItem href="/" text="Home" />
          <HeaderItem href="/about-us" text="About Us" />

          <HeaderItem href="/female-models" text="Talent" />
          <HeaderItem href="/contact" text="Contact" />
        </div>
      </div>
    </HomeSectionLayout>
  );
};

export default Footer;
