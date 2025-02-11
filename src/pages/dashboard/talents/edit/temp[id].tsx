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
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Edit Profile
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Basic Information</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Name"
                placeholder="Type your name"
                size="lg"
                value={name}
                isRequired
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Street Address 1"
                placeholder="Type your address"
                size="lg"
                value={street1}
                isRequired
                onChange={(e) => setStreet1(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Street Address 2"
                placeholder="Type your address"
                size="lg"
                value={street2}
                onChange={(e) => setStreet2(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="City"
                placeholder="Type your city"
                size="lg"
                value={city}
                isRequired
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="State"
                placeholder="Type your state"
                size="lg"
                isRequired
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Zip"
                placeholder="Type your zip"
                size="lg"
                isRequired
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
              <Input
                type="number"
                variant="bordered"
                className="w-full"
                label="Age"
                size="lg"
                isRequired
                min={0}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <Select
                variant="bordered"
                label="Select your Gender"
                size="lg"
                selectedKeys={gender}
                onSelectionChange={setGender as any}
                isRequired
              >
                {Gender.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant="bordered"
                label="Select your languages"
                size="lg"
                selectionMode="multiple"
                selectedKeys={languages}
                onSelectionChange={setLanguages as any}
                isRequired
              >
                {Languages.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Basic Information</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Select
                variant="bordered"
                label="Select your hair color"
                size="lg"
                isRequired
                selectedKeys={hairColor}
                onSelectionChange={setHairColor as any}
              >
                {HairColor.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant="bordered"
                label="Select your eye color"
                size="lg"
                isRequired
                selectedKeys={eyeColor}
                onSelectionChange={setEyeColor as any}
              >
                {EyeColor.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant="bordered"
                label="Select your ethnicity"
                size="lg"
                isRequired
                selectedKeys={ethnicity}
                onSelectionChange={setEhtnicity as any}
              >
                {Ethnicity.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Certifications</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Select
                variant="bordered"
                label="Certifications"
                size="lg"
                selectionMode="multiple"
                selectedKeys={certification}
                onSelectionChange={setCertification as any}
              >
                {Certifications.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
              <input
                type="date"
                value={certificationDate}
                onChange={(e) => setCertificationDate(e.target.value)}
                className="outline-none w-full border-[2px] p-2 rounded-xl"
              />
            </div>
          </div>

          {/* Section 3 */}

          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Dimensions</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Select
                variant="bordered"
                label="Select your height"
                size="lg"
                isRequired
                selectedKeys={height}
                onSelectionChange={setHeight as any}
              >
                {Height.map((item) => (
                  <SelectItem key={item.label} value={item.label}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant="bordered"
                label="Select your waist size"
                size="lg"
                isRequired
                selectedKeys={waist}
                onSelectionChange={setWaist as any}
              >
                {Waist.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant="bordered"
                label="Select your hip size"
                size="lg"
                isRequired
                selectedKeys={hip}
                onSelectionChange={setHip as any}
              >
                {Hips.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant="bordered"
                label="Select your bust size"
                size="lg"
                isRequired
                selectedKeys={bust}
                onSelectionChange={setBust as any}
              >
                {Bust.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant="bordered"
                label="Select your shoe size"
                size="lg"
                isRequired
                selectedKeys={shoeSize}
                onSelectionChange={setShoeSize as any}
              >
                {Shoesize.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant="bordered"
                label="Select your dress size"
                size="lg"
                isRequired
                // defaultSelectedKeys={[dressSize ? dressSize : '3']}
                selectedKeys={dressSize}
                onSelectionChange={setDressSize as any}
              >
                {Dresssize.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          {/* Section 4 */}
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Contact Information</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Cell Phone"
                isRequired
                placeholder="Type your phone number"
                size="lg"
                value={cellPhone}
                onChange={handleCellPhone}
              />
              <Input
                type="email"
                variant="bordered"
                className="w-full"
                label="Email"
                isRequired
                placeholder="Type your email address"
                color="danger"
                description="NOTE: If you change your email address, your username will be updated too."
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full mt-[40px]"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </main>
  );
}
