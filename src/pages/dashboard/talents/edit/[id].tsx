import { GetAccountInformation } from "@/actions/getAccountInformation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Ethnicity,
  EyeColor,
  Gender,
  HairColor,
  Languages,
  Bust,
  Dresssize,
  Height,
  Hips,
  Shoesize,
  Waist,
  Certifications,
} from "@/lib/selectoptions";
import { EditProfile } from "@/actions/updateProfile";
import { useRouter } from "next/router";

export default function EditAccountbyid() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const router = useRouter();

  const [name, setName] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [age, setAge] = useState("");
  const [languages, setLanguages] = useState(new Set<string>(["English"]));
  const [hairColor, setHairColor] = useState(new Set<string>(["Blonde"]));
  const [eyeColor, setEyeColor] = useState(new Set<string>(["Black"]));
  const [ethnicity, setEhtnicity] = useState(new Set<string>(["Other"]));
  const [height, setHeight] = useState(new Set<string>([`1' 0" `]));
  const [waist, setWaist] = useState(new Set<string>(["20"]));
  const [hip, setHip] = useState(new Set<string>(["30"]));
  const [bust, setBust] = useState(new Set<string>(["1"]));
  const [shoeSize, setShoeSize] = useState(new Set<string>(["1"]));
  const [dressSize, setDressSize] = useState(new Set<string>(["2"]));
  const [email, setEmail] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [gender, setGender] = useState(new Set<string>(["Male"]));
  const [previousEmail, setPreviousEmail] = useState("");

  const [url, setUrl] = useState("");

  const [certification, setCertification] = useState(new Set<string>([]));
  const [certificationDate, setCertificationDate] = useState<any>();

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
        const data = result.data.data;

        if (data.fields) {
          // setFirstName(data?.fields["TALENT FIRST NAME"]);
          // setLastName(data?.fields["TALENT LAST NAME"]);
          setName(data?.fields["TALENT FULL NAME"]);
          setStreet1(data?.fields["Street Address 1"]);
          setStreet2(data?.fields["Street Address 2"]);
          setCity(data?.fields.City);
          setState(data?.fields.State);
          setZip(data?.fields.Zip);
          setAge(data?.fields.AGE);
          setLanguages(new Set<string>(data?.fields?.["Languages"]));
          setHairColor(new Set<string>([data?.fields?.["Hair Color"]]));
          setEyeColor(new Set<string>([data?.fields?.["Eye Color"]]));
          setEhtnicity(new Set<string>([data?.fields?.["Ethnicity"]]));
          setHeight(new Set<string>([data?.fields?.["Height"]]));
          setWaist(new Set<string>([data?.fields?.["Waist"]]));
          setHip(new Set<string>([data?.fields?.["Hips"]]));
          setBust(new Set<string>([data?.fields?.["Bust"]]));
          setShoeSize(new Set<string>([data?.fields?.["Shoe Size"]]));
          setDressSize(new Set<string>([data?.fields?.["Dress Size"]]));
          setGender(new Set<string>([data?.fields?.["Gender"]]));
          setEmail(data?.fields["Email"]);
          setPreviousEmail(data?.fields["Email"]);
          setCellPhone(data?.fields["Cell Phone"]);
          setCertification(new Set<string>(data?.fields?.["Type of Permit"]));
          setCertificationDate(data?.fields?.["Permit Expiration Date"]);
          setUrl(data?.fields?.["TALENT LOGIN EMAIL [internal]"]);
          console.log(data?.fields?.["TALENT LOGIN EMAIL [internal]"]);
        }
        setDataLoading(false);
      }
    })();
  }, [router.query.id]);

  const handleUpdate = async () => {
    if (name.length === 0) {
      toast.error("Name is required!");
      return;
    }
    if (street1.length === 0) {
      toast.error("Address1 is required!");
      return;
    }
    if (city.length === 0) {
      toast.error("City is required!");
      return;
    }
    if (state.length === 0) {
      toast.error("State is required!");
      return;
    }
    if (zip.length === 0) {
      toast.error("Zip is required!");
      return;
    }
    const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

    if (phonePattern.test(cellPhone) === false) {
      toast.error("Phone number is incorrect!");
      return;
    }

    if (email.length === 0) {
      toast.error("Email is required!");
      return;
    }
    setDataLoading(true);
    const result = await EditProfile(
      router?.query?.id?.toString() || "",
      accountType,
      name,
      street1,
      street2,
      city,
      state,
      zip,
      Number(age),
      gender,
      hairColor,
      eyeColor,
      ethnicity,
      languages,
      height,
      waist,
      hip,
      bust,
      shoeSize,
      dressSize,
      cellPhone,
      email,
      previousEmail,
      certification,
      certificationDate
    );
    setDataLoading(false);
    if (result.status === true) toast.success(result.data.message);
    else toast.error(result.data.message);
  };

  const handleCellPhone = (e: any) => {
    let num = e.target.value.replace(/\D/g, "");

    setCellPhone(
      "(" +
        num.substring(0, 3) +
        ") " +
        num.substring(3, 6) +
        "-" +
        num.substring(6, 10)
    );
  };

  return (
    <main
      className={`xl:flex xl:flex-row justify-stretch  bg-gray-100 `}
    >
      <Sidebar />
      <div className=" w-full">
        {/* <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Talent Info Update
        </p> */}
        <div className="rounded-2xl flex flex-col gap-5 w-full  h-[calc(100vh-80px)]">
          {/* <iframe
            id="miniExtIframe-vyQUCWecb3MFS2g8OBFI"
            height="1150"
            src={`https://web.miniextensions.com/DIY9FcToBrEMD2mlJQTW?login_TALENT LOGIN EMAIL [internal]=${url}`}
          ></iframe> */}
          <iframe
            id="miniExtIframe-EhT20e1u8MYm0mSqRA7t"
            height="100%"
            src="https://web.miniextensions.com/EhT20e1u8MYm0mSqRA7t"
          ></iframe>
          <script
            id="embed-script-id"
            type="text/javascript"
            src="https://web.miniextensions.com/statics/embed.js?miniExtIframeId=miniExtIframe-vyQUCWecb3MFS2g8OBFI"
          ></script>
        </div>
      </div>
    </main>
  );
}
