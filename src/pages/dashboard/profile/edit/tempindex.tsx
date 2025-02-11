import { GetAccountInformation } from "@/actions/getAccountInformation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
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
  Cities,
  InseamSize,
  SuitSize,
  SpecialSkills,
  JOBSTATE,
  PROFILESTATE,
  MinHourlyRate,
  MinDailyRate,
} from "@/lib/selectoptions";
import { EditProfile } from "@/actions/updateProfile";

export default function EditAccount() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const [name, setName] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [age, setAge] = useState("");
  const [languages, setLanguages] = useState(["English"]);
  const [hairColor, setHairColor] = useState(new Set<string>(["Blonde"]));
  const [eyeColor, setEyeColor] = useState(new Set<string>(["Black"]));
  const [ethnicity, setEhtnicity] = useState("Prefer not to say");
  const [height, setHeight] = useState(new Set<string>([`1' 0" `]));
  const [waist, setWaist] = useState(new Set<string>(["20"]));
  const [hip, setHip] = useState(new Set<string>(["30"]));
  const [bust, setBust] = useState(new Set<string>(["1"]));
  const [shoeSize, setShoeSize] = useState(new Set<string>(["1"]));
  const [dressSize, setDressSize] = useState(new Set<string>(["2"]));
  const [email, setEmail] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [gender, setGender] = useState("");
  const [previousEmail, setPreviousEmail] = useState("");
  //
  const [inseam, setInseam] = useState(new Set<string>(["20"]));
  const [suit, setSuit] = useState(new Set<string>(["36R"]));
  const [skills, setSkills] = useState([]);
  const [middleName, setMiddleName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [dba, setDba] = useState("");
  const [minHourly, setMinHourly] = useState(new Set<string>(["$20.00"]));
  const [minDaily, setMinDaily] = useState(new Set<string>(["$150.00"]));
  const [instagram, setInstagram] = useState('');
  const [castingNetwork, setCastingNetwork] = useState('');

  const [emergencyContact, setEmergencyContact] = useState('');
  const [relationShip, setRelationShip] = useState('');
  const [emergencyCell, setEmergencyCell] = useState('');
  //
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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

  const handleEmregencyCell = (e: any) => {
    let num = e.target.value.replace(/\D/g, "");

    setEmergencyCell(
      "(" +
        num.substring(0, 3) +
        ") " +
        num.substring(3, 6) +
        "-" +
        num.substring(6, 10)
    );
  };

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const result = await GetAccountInformation(airtable_id, accountType);
        if (result.status === false) {
          toast.error("Please check your internet connection!");
          return;
        }
        const data = result.data;
        console.log(data);
        if (data.fields) {
          // setFirstName(data?.fields["TALENT FIRST NAME"]);
          // setLastName(data?.fields["TALENT LAST NAME"]);
          setName(data?.fields["TALENT FULL NAME"]);
          setMiddleName(data?.fields?.["TALENT MIDDLE"] || "");
          setFirstName(data?.fields["TALENT FULL NAME"]?.split(" ")?.[0]);
          setLastName(data?.fields["TALENT FULL NAME"]?.split(" ")?.[1]);
          setSuffix(data?.fields?.["SUFFIX"] || "");
          setDba(data?.fields?.["DBA"] || "");
          setStreet1(data?.fields["Street Address 1"]);
          setStreet2(data?.fields["Street Address 2"]);
          setCity(data?.fields.City);
          setState(data?.fields.State);
          setZip(data?.fields.Zip);
          setAge(data?.fields.AGE);
          if (data?.fields?.["Languages"])
            setLanguages(data?.fields["Languages"]);
          if (data?.fields?.["Hair Color"])
            setHairColor(new Set<string>([data?.fields["Hair Color"]]));
          if (data?.fields?.["Eye Color"])
            setEyeColor(new Set<string>([data?.fields["Eye Color"]]));
          if (data?.fields?.["Ethnicity"])
            setEhtnicity(data?.fields["Ethnicity"]);
          if (data?.fields?.["Height"])
            setHeight(new Set<string>([data?.fields["Height"]]));
          if (data?.fields?.["Waist"])
            setWaist(new Set<string>([data?.fields["Waist"]]));
          if (data?.fields?.["Hips"])
            setHip(new Set<string>([data?.fields["Hips"]]));
          if (data?.fields?.["Bust"])
            setBust(new Set<string>([data?.fields["Bust"]]));
          if (data?.fields?.["Shoe Size"])
            setShoeSize(new Set<string>([data?.fields["Shoe Size"]]));
          if (data?.fields?.["Dress Size"])
            setDressSize(new Set<string>([data?.fields["Dress Size"]]));
          if (data?.fields?.["Gender"]) setGender(data?.fields["Gender"]);
          if (data?.fields?.["Inseam"])
            setInseam(new Set<string>([data?.fields["Inseam"]]));
          if (data?.fields?.["Suit"])
            setSuit(new Set<string>([data?.fields["Suit"]]));
          if (data?.fields?.["Min Hourly Rate"])
            setMinHourly(new Set<string>([data?.fields["Min Hourly Rate"]]));
          if (data?.fields?.["Min Daily Rate"])
            setMinDaily(new Set<string>([data?.fields["Min Daily Rate"]]));
          setEmail(data?.fields["Email"]);
          setPreviousEmail(data?.fields["Email"]);
          setCellPhone(data?.fields["Cell Phone"]);
          setInstagram(data?.fields?.['Instagram'] || "");
          setCastingNetwork(data?.fields?.["Casting Networks Link"] || '')
        }
        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleUpdate = async () => {
    if (firstName?.length === 0) {
      toast.error("First Name is required!");
      return;
    }
    if (lastName?.length === 0) {
      toast.error("Last Name is required!");
      return;
    }
    if (street1?.length === 0) {
      toast.error("Address1 is required!");
      return;
    }
    if (city?.length === 0) {
      toast.error("City is required!");
      return;
    }
    if (state?.length === 0) {
      toast.error("State is required!");
      return;
    }
    if (zip?.length === 0) {
      toast.error("Zip is required!");
      return;
    }
    console.log(ethnicity);
    const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

    if (phonePattern.test(cellPhone) === false) {
      toast.error("Phone number is incorrect!");
      return;
    }
    if (email?.length === 0) {
      toast.error("Email is required!");
      return;
    }
    const result = await EditProfile(
      airtable_id,
      accountType,
      firstName + " " + lastName,
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
      null,
      null,
      middleName,
      suffix,
      dba,
      inseam,
      suit,
      minHourly,
      minDaily,
      instagram,
      castingNetwork,
      skills,
      emergencyContact,
      relationShip,
      emergencyCell
    );
    if (result.status === true) toast.success(result.data.message);
    else toast.error(result.data.message);
  };

  useEffect(() => {
    console.log(ethnicity);
  }, [ethnicity]);

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100 text-black light`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px] text-black">
          Edit Profile
        </p>
        <div className="flex flex-col gap-[30px] bg-white shadow-md p-5 rounded-2xl">
          <div className="grid grid-cols-4 gap-5 ">
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="First Name"
              placeholder="Type your First Name"
              size="md"
              value={firstName}
              isRequired
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="Middle Name"
              size="md"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="Last Name"
              placeholder="Type your Last Name"
              size="md"
              value={lastName}
              isRequired
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="SUFFIX"
              size="md"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
            />
          </div>
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="DBA"
            size="md"
            placeholder="Do you have a different name that you 'Do Business As'"
            value={dba}
            isRequired
            onChange={(e) => setDba(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-5">
            <RadioGroup
              label="GENDER"
              isRequired
              color="default"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <Radio value="Female">
                <Chip color="danger">Female</Chip>
              </Radio>
              <Radio value="Male">
                <Chip color="primary" className="bg-[#00a2e8]">
                  Male
                </Chip>
              </Radio>
            </RadioGroup>
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="AGE"
              size="md"
              isRequired
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            {/* <div className="flex flex-col gap-2">
              <p>DATE OF BIRTH<span className="text-red-500">*</span></p>
              <input type="date" className="border-1 p-1 rounded-md" />
            </div> */}
            <Input
              type="email"
              variant="bordered"
              className="w-full"
              label="Email"
              isRequired
              placeholder="Type your email address"
              color="danger"
              description="NOTE: If you change your email address, your username will be updated too."
              size="md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="Cell Phone"
              isRequired
              placeholder="Type your phone number"
              size="md"
              value={cellPhone}
              onChange={handleCellPhone}
            />
          </div>
          <div className="flex flex-col gap-1 text-black">
            <p className="font-bold">TEXT MESSAGING</p>
            <p>
              Do consent to receive text messages regarding job openings and
              related opportunities?
            </p>
            <Checkbox color="default" />
          </div>
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="STREET ADDRESS"
            size="md"
            value={street1}
            isRequired
            onChange={(e) => setStreet1(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-5">
            <Autocomplete
              label="CITY"
              isRequired
              variant="bordered"
              size="md"
              allowsCustomValue={true}
              onInputChange={(e) => setCity(e.toString())}
              value={city}
            >
              {Cities.map((item) => (
                <AutocompleteItem key={item}>{item}</AutocompleteItem>
              ))}
            </Autocomplete>
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="STATE"
              size="md"
              isRequired
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="ZIP CODE"
              size="md"
              isRequired
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-bold">MY INFORMATION IS CORRECT</p>
            <Checkbox color="default" />
          </div>

          <Accordion
            selectionMode="multiple"
            id="accordion"
            defaultExpandedKeys={[
              "JOB TYPES",
              "Male Stats",
              "Female Stats",
              "Languages",
              "SKILLS",
              "EMERGENCY CONTACT",
              "JOB LOCATIONS",
              "CONFIRMATION",
            ]}
          >
            <AccordionItem
              key="JOB TYPES"
              aria-label="JOB INFORMATION"
              title="JOB TYPES"
              className="accordion-items"
            >
              <div className={`bg-white p-5 flex flex-col gap-4`}></div>
            </AccordionItem>
            <AccordionItem
              key="Male Stats"
              aria-label="Male STATS"
              title="STATS"
              className={`${gender === "Male" ? "" : "hidden"} accordion-items`}
            >
              <div className="flex flex-col gap-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    variant="bordered"
                    label="Height"
                    size="md"
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
                    label="Waist"
                    size="md"
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
                    label="HAIR COLOR"
                    size="md"
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
                    label="EYE COLOR"
                    size="md"
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
                </div>
                <Select
                  variant="bordered"
                  label="SHOE SIZE"
                  size="md"
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
                  label="INSEAM"
                  size="md"
                  className="text-black"
                  isRequired
                  selectedKeys={inseam}
                  onSelectionChange={setInseam as any}
                >
                  {InseamSize.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  variant="bordered"
                  label="SUIT SIZE"
                  size="md"
                  isRequired
                  selectedKeys={suit}
                  onSelectionChange={setSuit as any}
                >
                  {SuitSize.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>
                <RadioGroup
                  value={ethnicity}
                  onChange={(e) => setEhtnicity(e.target.value)}
                  label="Ethnicity"
                  isRequired
                >
                  {Ethnicity.map((item) => (
                    <Radio value={item.value}>{item.label}</Radio>
                  ))}
                </RadioGroup>
                <div className="flex flex-row gap-4">
                  <Select
                    variant="bordered"
                    label="MINIMUM HOURLY RATE"
                    size="md"
                    isRequired
                    // defaultSelectedKeys={[dressSize ? dressSize : '3']}
                    selectedKeys={minHourly}
                    onSelectionChange={setMinHourly as any}
                  >
                    {MinHourlyRate.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    variant="bordered"
                    label="MINIMUM DAILY RATE"
                    size="md"
                    isRequired
                    // defaultSelectedKeys={[dressSize ? dressSize : '3']}
                    selectedKeys={minDaily}
                    onSelectionChange={setMinDaily as any}
                  >
                    {MinDailyRate.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <Input
                  type="text"
                  variant="bordered"
                  className="w-full"
                  label="INSTAGRAM PROFILE"
                  size="md"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
                <Input
                  type="text"
                  variant="bordered"
                  className="w-full"
                  label="CASTING NETWORKS PROFILE"
                  size="md"
                  value={castingNetwork}
                  onChange={(e) => setCastingNetwork(e.target.value)}
                />
              </div>
            </AccordionItem>
            <AccordionItem
              key="Female Stats"
              aria-label="Female STATS"
              title="STATS"
              className={`${
                gender === "Female" ? "" : "hidden"
              } accordion-items`}
            >
              <div className="flex flex-col gap-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    variant="bordered"
                    label="Height"
                    size="md"
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
                    label="Waist"
                    size="md"
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
                    label="HAIR COLOR"
                    size="md"
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
                    label="EYE COLOR"
                    size="md"
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
                </div>

                <Select
                  variant="bordered"
                  label="SHOE SIZE"
                  size="md"
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
                  label="DRESS SIZE"
                  size="md"
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
                <Select
                  variant="bordered"
                  label="HIPS"
                  size="md"
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
                  label="BUST"
                  size="md"
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
                <RadioGroup
                  value={ethnicity}
                  onChange={(e) => setEhtnicity(e.target.value)}
                  label="Ethnicity"
                  isRequired
                >
                  {Ethnicity.map((item) => (
                    <Radio value={item.value}>{item.label}</Radio>
                  ))}
                </RadioGroup>
                <div className="flex flex-row gap-4">
                  <Select
                    variant="bordered"
                    label="MINIMUM HOURLY RATE"
                    size="md"
                    isRequired
                    // defaultSelectedKeys={[dressSize ? dressSize : '3']}
                    selectedKeys={minHourly}
                    onSelectionChange={setMinHourly as any}
                  >
                    {MinHourlyRate.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    variant="bordered"
                    label="MINIMUM DAILY RATE"
                    size="md"
                    isRequired
                    // defaultSelectedKeys={[dressSize ? dressSize : '3']}
                    selectedKeys={minDaily}
                    onSelectionChange={setMinDaily as any}
                  >
                    {MinDailyRate.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <Input
                  type="text"
                  variant="bordered"
                  className="w-full"
                  label="INSTAGRAM PROFILE"
                  size="md"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
                <Input
                  type="text"
                  variant="bordered"
                  className="w-full"
                  label="CASTING NETWORKS PROFILE"
                  size="md"
                  value={castingNetwork}
                  onChange={(e) => setCastingNetwork(e.target.value)}
                />
              </div>
            </AccordionItem>
            <AccordionItem
              key="Languages"
              aria-label="LANGUAGES"
              title="LANGUAGES"
              className="accordion-items"
            >
              <div className={`flex flex-col gap-2 p-5`}>
                <p className="text-[16px] font-bold">
                  LANGUAGES SPOKEN <span className="text-red-500">*</span>
                </p>
                <p className="text-[12px] text-gray-500">
                  Select all of the languages you can speak fluently.
                </p>
                <CheckboxGroup value={languages} onChange={setLanguages as any}>
                  {Languages.map((item) => (
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </AccordionItem>
            <AccordionItem
              key="SKILLS"
              aria-label="SKILLS"
              title="SKILLS"
              className="accordion-items"
            >
              <div className={`flex flex-col gap-2 p-5`}>
                <p className="text-[16px] font-bold">SKILLS</p>
                <CheckboxGroup
                  value={skills}
                  onChange={setSkills as any}
                  size="md"
                >
                  {SpecialSkills.map((item) => (
                    <Checkbox value={item.value}>
                      <Chip color="default">{item.label}</Chip>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </AccordionItem>
            <AccordionItem
              key="EMERGENCY CONTACT"
              aria-label="EMERGENCY CONTACT"
              title="EMERGENCY CONTACT"
              className="accordion-items"
            >
              <div className={`flex flex-col gap-2 p-5`}>
                <Input
                  type="text"
                  variant="bordered"
                  className="w-full"
                  label="EMERGENCY CONTACT"
                  size="md"
                  value={emergencyContact}
                  isRequired
                  onChange={(e) => setEmergencyContact(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    variant="bordered"
                    className="w-full"
                    label="RELATION SHIP"
                    size="md"
                    value={relationShip}
                    isRequired
                    onChange={(e) => setRelationShip(e.target.value)}
                  />
                  <Input
                    type="text"
                    variant="bordered"
                    className="w-full"
                    label="EMERGENCY CONTACT CELL #"
                    size="md"
                    value={emergencyCell}
                    isRequired
                    onChange={handleEmregencyCell}
                  />
                </div>
              </div>
            </AccordionItem>
            <AccordionItem
              key="JOB LOCATIONS"
              aria-label="JOB LOCATIONS"
              title="JOB LOCATIONS"
              className="accordion-items"
            >
              <div className={`flex flex-col gap-2 p-5`}>
                <p className="text-[12px] text-gray-500">
                  Please choose all the locations where you can work without
                  incurring any additional travel costs.
                </p>
                <Select
                  variant="bordered"
                  label="State"
                  size="md"
                  selectedKeys={state}
                  isRequired
                  onSelectionChange={setState as any}
                  className=" rounded-xl"
                >
                  {PROFILESTATE.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>
                {/* <Autocomplete
                    label="Major City"
                    isRequired
                    variant="bordered"
                    size="sm"
                    allowsCustomValue={true}
                    onInputChange={(e) => setMajorCities(e.toString())}
                    value={majorCities}
                  >
                    {Cities.map((item) => (
                      <AutocompleteItem key={item}>{item}</AutocompleteItem>
                    ))}
                  </Autocomplete> */}
              </div>
            </AccordionItem>
            <AccordionItem
              key="CONFIRMATION"
              aria-label="CONFIRMATION"
              title="CONFIRMATION"
              className="accordion-items"
            >
              <div className={`flex flex-col gap-2 p-5`}>
                <p className="font-medium">
                  I confirm the information I submitted is correct.{" "}
                  <span className="text-red-500">*</span>
                </p>
                <Checkbox defaultChecked></Checkbox>
              </div>
            </AccordionItem>
          </Accordion>
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
