import { StepsLayout } from "@/components/Steps/StepsLayout";
import { NavigationButtons } from "@/components/Steps/NavigationButtons";
import Sidebar from "@/components/Sidebar";
import { SearchTalent } from "@/actions/searchTalent";
import { Pagination } from "@/components/Pagination";
import {
  BookingType,
  Cities,
  Dresssize,
  EthnicityType,
  EyeColorType,
  Gender,
  GenderType,
  HairColorType,
  Height,
  Hips,
  JOBSTATE,
  LanguagesType,
  Shoesize,
  Tags_type,
  TalentType,
} from "@/lib/selectoptions";
import useParticipantStore from "@/store/use-participant";
import { faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Slider,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import Talent from "@/components/Talent";
import { GetAccountInformation } from "@/actions/getAccountInformation";
import { toast } from "react-toastify";
import { Information } from "@/components/Information";
import useJobState from "@/store/use-job";
import { useRouter } from "next/router";
import { GetJobById } from "@/actions/getJobById";
import { SubHeader } from "@/components/Jobs/SubHeader";
import Link from "next/link";
import { EditJobTalent } from "@/actions/editJobTalent";
import { clientAuth } from "@/lib/firebaseclient";

export default function StepTwo() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const [name, setName] = useState("");
  const [tags, setTags] = useState<any>(new Set<string>([]));
  const [bookings, setBookings] = useState<any>(new Set<string>([]));

  const [gender, setGender] = useState(new Set<string>(["ALL"]));
  const [talentType, setTalentType] = useState(new Set<string>(["ALL"]));
  const [hairColor, setHairColor] = useState(new Set<string>(["ALL"]));
  const [eyeColor, setEyeColor] = useState(new Set<string>(["ALL"]));
  const [ethnicity, setEthnicity] = useState(new Set<string>(["ALL"]));
  const [language, setLanguage] = useState(new Set<string>(["ALL"]));

  const [fromHeight, setFromHeight] = useState(new Set<string>([`1' 0" `]));
  const [toHeight, setToHeight] = useState(new Set<string>([`6' 11" `]));

  const [fromShoeSize, setFromShoeSize] = useState(new Set<string>([`1`]));
  const [toShoeSize, setToShoeSize] = useState(new Set<string>([`16`]));

  const [fromDressSize, setFromDressSize] = useState(new Set<string>([`2`]));
  const [toDressSize, setToDressSize] = useState(new Set<string>([`16`]));

  const [startAge, setStartAge] = useState("0");
  const [endAge, setEndgAge] = useState("100");
  const [majorCity, setMajorCity] = useState("");
  const [city, setCity] = useState("");

  const [pageIndex, setPageIndex] = useState(0);
  const [offsetArr, setOffsetArr] = useState([""]);
  const [pageSize, setPageSize] = useState(new Set<string>([`10`]));
  const [records, setRecords] = useState<any>();

  const [filterHidden, setFilterHidden] = useState(true);

  const [selectedTalent, setSelectedTalent] = useState<any>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<any>();

  const { talentInvited, setTalentInvited } = useJobState((state) => state);

  const router = useRouter();
  const [talentPending, setTalentPending] = useState<Array<any>>([]);
  const [talentAceepted, setTalentAccepted] = useState<Array<any>>([]);
  const [talentDeclined, setTalentDeclined] = useState<Array<any>>([]);
  const [talentCancel, setTalentCancel] = useState<Array<any>>([]);

  const [zipCode, setZipCode] = useState("");
  const [distance, setDistance] = useState(0);

  const [selectedKeys, setSelectedKeys] = useState<any>(
    new Set(["JOB INFORMATION"])
  );

  const [state, setState] = useState(new Set<string>([`ALL`]));
  const [rating, setRating] = useState(new Set<string>([]));
  const [status, setStatus] = useState(new Set<string>([]));

  useEffect(() => {
    (async () => {
      if (airtable_id && pageSize && router.query.id) {
        setDataLoading(true);
        const data = await GetJobById(router.query.id.toString());
        if (data.status === true) {
          setTalentPending(data.data?.unaccepted?.records || []);
          setTalentAccepted(data.data?.available?.records || []);
          setTalentDeclined(data.data?.unavailable?.records || []);
          setTalentCancel(data.data?.talent_declined?.records || []);
        }
        const result = await SearchTalent(
          name,
          Array.from(gender).toString(),
          Array.from(talentType).toString(),
          Array.from(startAge).toString(),
          Array.from(endAge).toString(),
          majorCity,
          Array.from(hairColor).toString(),
          Array.from(eyeColor).toString(),
          Array.from(fromHeight).toString(),
          Array.from(toHeight).toString(),
          Array.from(fromShoeSize).toString(),
          Array.from(toShoeSize).toString(),
          Array.from(fromDressSize).toString(),
          Array.from(toDressSize).toString(),
          Array.from(language).toString(),
          Array.from(ethnicity).toString(),
          offsetArr[0],
          Array.from(pageSize).toString(),
          city,
          tags,
          bookings,
          zipCode,
          distance,
          state,
          rating,
          status
        );
        console.log("records:", records);
        setPageIndex(0);
        setOffsetArr(["", result.data.offset]);
        setRecords(result.data.records);
        setDataLoading(false);
      }
    })();
  }, [
    airtable_id,
    pageSize,
    router.query.id,
    tags,
    bookings,
    distance,
    state,
    rating,
    status, language
  ]);

  const handleSearch = async () => {
    setDataLoading(true);
    const result = await SearchTalent(
      name,
      Array.from(gender).toString(),
      Array.from(talentType).toString(),
      Array.from(startAge).toString(),
      Array.from(endAge).toString(),
      majorCity,
      Array.from(hairColor).toString(),
      Array.from(eyeColor).toString(),
      Array.from(fromHeight).toString(),
      Array.from(toHeight).toString(),
      Array.from(fromShoeSize).toString(),
      Array.from(toShoeSize).toString(),
      Array.from(fromDressSize).toString(),
      Array.from(toDressSize).toString(),
      Array.from(language).toString(),
      Array.from(ethnicity).toString(),
      offsetArr[0],
      Array.from(pageSize).toString(),
      city,
      tags,
      bookings,
      zipCode,
      distance,
      state,
      rating,
      status
    );
    // console.log(result.data);
    // const temp = offsetArr;
    // temp.push(result.data.records);
    // setOffsetArr(temp);
    setPageIndex(0);
    setOffsetArr(["", result.data.offset]);
    setRecords(result.data.records);
    setDataLoading(false);
  };

  const handlePagenation = async (index: any) => {
    if (index < 0) return;
    if (pageIndex === index) return;
    setDataLoading(true);

    const result = await SearchTalent(
      name,
      Array.from(gender).toString(),
      Array.from(talentType).toString(),
      Array.from(startAge).toString(),
      Array.from(endAge).toString(),
      majorCity,
      Array.from(hairColor).toString(),
      Array.from(eyeColor).toString(),
      Array.from(fromHeight).toString(),
      Array.from(toHeight).toString(),
      Array.from(fromShoeSize).toString(),
      Array.from(toShoeSize).toString(),
      Array.from(fromDressSize).toString(),
      Array.from(toDressSize).toString(),
      Array.from(language).toString(),
      Array.from(ethnicity).toString(),
      offsetArr[index],
      Array.from(pageSize).toString(),
      city,
      tags,
      bookings,
      zipCode,
      distance,
      state,
      rating,
      status
    );
    setPageIndex(index);
    if (offsetArr.length === index + 1)
      setOffsetArr([...offsetArr, result.data.offset]);
    // console.log(result.data);
    // const temp = offsetArr;
    // temp.push(result.data.records);
    // setOffsetArr(temp);
    setRecords(result.data.records);
    setDataLoading(false);
  };

  // const handleSelectTalent = async (id: string, name: string) => {
  //   setDataLoading(true);
  //   // const result = await GetAccountInformation(id, "talent");
  //   // if (result.status === false) {
  //   //   toast.error("Please check your internet connection!");
  //   //   return;
  //   // }
  //   // const data = result.data;
  //   // if (data.fields) {
  //   //   console.log(data);
  //   //   setSelectedTalent({ id, name });
  //   //   setData(data.fields);
  //   //   onOpenChange();
  //   // }
  //   setDataLoading(false);
  // };

  const handleAddTalent = (id: string, name: string, url: string) => {
    // const newTalent = selectedTalent;
    // console.log(newTalent);
    const isIdInArray =
      talentPending.some((item: any) => item.id === id) ||
      talentAceepted.some((item: any) => item.id === id) ||
      talentDeclined.some((item: any) => item.id === id) ||
      talentCancel.some((item: any) => item.id === id);
    if (isIdInArray) {
      toast.warning("This talent was already added to this job!");
    } else {
      setTalentPending([...talentPending, { id, name, url }]);
      toast.success("Successfully added talent to this job!");
    }
    // onOpenChange();
  };

  const handleAllAddTalent = () => {
    let pendinglist = [];
    for (let i = 0; i < records?.length; i++) {
      const isIdInArray =
        talentPending.some((item: any) => item.id === records[i].id) ||
        talentAceepted.some((item: any) => item.id === records[i].id) ||
        talentDeclined.some((item: any) => item.id === records[i].id) ||
        talentCancel.some((item: any) => item.id === records[i].id);
      if (!isIdInArray) {
        pendinglist.push({
          id: records[i].id,
          name: records[i].fields.Name,
          url: records[i].fields.Pictures
            ? records[i].fields.Pictures?.split(",")?.[0]
            : "",
        });
      }
    }
    setTalentPending([...talentPending, ...pendinglist]);
    toast.success("Successfully added talents to this job!");
  };

  const handleSubmit = async () => {
    onOpenChange();
    if (router.query.id) {
      setDataLoading(true);
      const res = await EditJobTalent(
        router.query.id.toString(),
        talentPending,
        clientAuth?.currentUser?.email || ""
      );
      if (res.status) {
        toast.success("Edited successfully!");
        router.push(`/job-board/${router.query.id}`);
      } else toast.error("Internal Server Error!");
      setDataLoading(false);
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      await handleSearch();
    }
  };

  const handleDelete = (idx: number) => {
    const updatedTalent = talentPending?.filter(
      (item: any, index: number) => index !== idx
    );

    setTalentPending(updatedTalent);
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Add Talent
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            {/* <div>
              {accountType !== "talent" ? (
                <div className="bg-gray-100 p-3 rounded-xl">
                  <SubHeader text="Talent List" />
                  <div className="flex flex-col gap-2">
                    {talentAceepted?.map((item: any, index) => (
                      <Link
                        key={index}
                        href={`/dashboard/talents/${item?.id}`}
                        target="_blank"
                      >
                        {item?.fields?.["TALENT FULL NAME"]}{" "}
                        <Chip color="success">Accepted</Chip>
                      </Link>
                    ))}
                    {talentPending?.map((item: any, index) => (
                      <Link
                        key={index}
                        href={`/dashboard/talents/${item?.id}`}
                        target="_blank"
                      >
                        {item?.fields?.["TALENT FULL NAME"]}{" "}
                        <Chip color="primary">Pending</Chip>
                      </Link>
                    ))}
                    {talentDeclined?.map((item: any, index) => (
                      <Link
                        key={index}
                        href={`/dashboard/talents/${item?.id}`}
                        target="_blank"
                      >
                        {item?.fields?.["TALENT FULL NAME"]}{" "}
                        <Chip color="danger">Declined</Chip>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div> */}
            {/*  */}
            <div className="flex flex-col justify-between">
              <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md flex flex-col lg:gap-[30px] gap-[10px]">
                <Accordion
                  selectionMode="multiple"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                  id="accordion"
                >
                  <AccordionItem
                    key="JOB INFORMATION"
                    aria-label="JOB INFORMATION"
                    title="SEARCH"
                    id="job-info"
                  >
                    <div
                      className={`bg-white grid md:grid-cols-2  sm:grid-cols-2 grid-cols-1 md:gap-[20px] gap-2 `}
                    >
                      <Input
                        type="text"
                        variant="bordered"
                        className="w-full"
                        label="Name"
                        size="sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Input
                        type="text"
                        variant="bordered"
                        className="w-full"
                        label="Zip Code"
                        size="sm"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Slider
                        label="Select a distance"
                        showTooltip={true}
                        size="sm"
                        step={5}
                        maxValue={30}
                        minValue={0}
                        marks={[
                          {
                            value: 10,
                            label: "10 mile",
                          },
                          {
                            value: 20,
                            label: "20 mile",
                          },
                        ]}
                        defaultValue={0.2}
                        value={distance}
                        onChange={setDistance as any}
                      />
                      <Select
                        variant="bordered"
                        label="Talent Status"
                        size="sm"
                        selectedKeys={status}
                        selectionMode="multiple"
                        onSelectionChange={setStatus as any}
                        className="rounded-xl"
                      >
                        <SelectItem key="ACTIVE" value="ACTIVE">
                          ACTIVE
                        </SelectItem>
                        <SelectItem key="INACTIVE" value="INACTIVE">
                          INACTIVE
                        </SelectItem>
                        <SelectItem key="ON-BOARDING" value="ON-BOARDING">
                          ON-BOARDING
                        </SelectItem>
                        <SelectItem key="REMOVED" value="REMOVED">
                          REMOVED
                        </SelectItem>
                        <SelectItem key="SUBMISSION" value="SUBMISSION">
                          SUBMISSION
                        </SelectItem>
                        <SelectItem key="PENDING REVIEW" value="PENDING REVIEW">
                          PENDING REVIEW
                        </SelectItem>
                      </Select>
                      <Select
                        label="Tags"
                        variant="bordered"
                        size="sm"
                        selectionMode="multiple"
                        selectedKeys={tags}
                        onSelectionChange={setTags}
                      >
                        {Tags_type.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        label="Types of Bookings"
                        variant="bordered"
                        size="sm"
                        selectionMode="multiple"
                        selectedKeys={bookings}
                        onSelectionChange={setBookings}
                      >
                        {BookingType.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        variant="bordered"
                        label="Rating"
                        size="sm"
                        selectedKeys={rating}
                        selectionMode="multiple"
                        onSelectionChange={setRating as any}
                        className="rounded-xl"
                      >
                        <SelectItem key="1" value="1">
                          1
                        </SelectItem>
                        <SelectItem key="2" value="2">
                          2
                        </SelectItem>
                        <SelectItem key="3" value="3">
                          3
                        </SelectItem>
                        <SelectItem key="4" value="4">
                          4
                        </SelectItem>
                        <SelectItem key="5" value="5">
                          5
                        </SelectItem>
                      </Select>

                      <Select
                        variant="bordered"
                        label="Talent Type"
                        size="sm"
                        selectedKeys={talentType}
                        onSelectionChange={setTalentType as any}
                      >
                        {TalentType.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </Select>
                      <div className="grid grid-cols-2 gap-[10px]">
                        <Input
                          type="number"
                          variant="bordered"
                          className="w-full"
                          label="From Age"
                          size="sm"
                          min={0}
                          max={100}
                          value={startAge}
                          onChange={(e) => setStartAge(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <Input
                          type="number"
                          variant="bordered"
                          className="w-full"
                          label="To Age"
                          size="sm"
                          min={0}
                          max={100}
                          value={endAge}
                          onChange={(e) => setEndgAge(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                      <Select
                        variant="bordered"
                        label="State"
                        size="sm"
                        selectedKeys={state}
                        isRequired
                        onSelectionChange={setState as any}
                        className="rounded-xl"
                      >
                        {JOBSTATE.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        variant="bordered"
                        label="Gender"
                        size="sm"
                        selectedKeys={gender}
                        onSelectionChange={setGender as any}
                      >
                        {GenderType.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Autocomplete
                        label="City"
                        isRequired
                        variant="bordered"
                        size="sm"
                        allowsCustomValue={true}
                        onKeyDown={handleKeyDown}
                        onInputChange={(e) => setCity(e.toString())}
                        value={city}
                      >
                        {Cities.map((item) => (
                          <AutocompleteItem key={item}>{item}</AutocompleteItem>
                        ))}
                      </Autocomplete>
                      <Autocomplete
                        label="Major City"
                        isRequired
                        variant="bordered"
                        size="sm"
                        allowsCustomValue={true}
                        onKeyDown={handleKeyDown}
                        onInputChange={(e) => setMajorCity(e.toString())}
                        value={city}
                      >
                        {Cities.map((item) => (
                          <AutocompleteItem key={item}>{item}</AutocompleteItem>
                        ))}
                      </Autocomplete>
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    key="SPECIFICATION"
                    aria-label="SPECIFICATION"
                    title="SPECIFICATION"
                    id="job-info"
                  >
                    <div
                      className={`bg-white grid md:grid-cols-2  sm:grid-cols-2 grid-cols-1 md:gap-[20px] gap-2 `}
                    >
                      <Select
                        variant="bordered"
                        label="Hair Color"
                        size="sm"
                        selectedKeys={hairColor}
                        onSelectionChange={setHairColor as any}
                      >
                        {HairColorType.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        variant="bordered"
                        label="Eye Color"
                        size="sm"
                        selectedKeys={eyeColor}
                        onSelectionChange={setEyeColor as any}
                      >
                        {EyeColorType.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <div className="grid grid-cols-2 gap-[10px]">
                        <Select
                          variant="bordered"
                          label="From Height"
                          size="sm"
                          selectedKeys={fromHeight}
                          onSelectionChange={setFromHeight as any}
                        >
                          {Height.map((item) => (
                            <SelectItem key={item.label} value={item.label}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          variant="bordered"
                          label="To Height"
                          size="sm"
                          selectedKeys={toHeight}
                          onSelectionChange={setToHeight as any}
                        >
                          {Height.map((item) => (
                            <SelectItem key={item.label} value={item.label}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-[10px]">
                        <Select
                          variant="bordered"
                          label="From Shoes Size"
                          size="sm"
                          selectedKeys={fromShoeSize}
                          onSelectionChange={setFromShoeSize as any}
                        >
                          {Shoesize.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          variant="bordered"
                          label="To Shoes Size"
                          size="sm"
                          selectedKeys={toShoeSize}
                          onSelectionChange={setToShoeSize as any}
                        >
                          {Shoesize.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-[10px]">
                        <Select
                          variant="bordered"
                          label="From Dress Size"
                          size="sm"
                          selectedKeys={fromDressSize}
                          onSelectionChange={setFromDressSize as any}
                        >
                          {Dresssize.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          variant="bordered"
                          label="To Dress Size"
                          size="sm"
                          selectedKeys={toDressSize}
                          onSelectionChange={setToDressSize as any}
                        >
                          {Dresssize.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <Select
                        variant="bordered"
                        label="Language"
                        size="sm"
                        selectedKeys={language}
                        onSelectionChange={setLanguage as any}
                      >
                        {LanguagesType.map((item) => (
                          <SelectItem key={item.label} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        variant="bordered"
                        label="Ethnicity"
                        size="sm"
                        selectedKeys={ethnicity}
                        onSelectionChange={setEthnicity as any}
                      >
                        {EthnicityType.map((item) => (
                          <SelectItem key={item.label} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </AccordionItem>
                </Accordion>
                <div className="">
                  
                  <div className="grid lg:grid-cols-3 2xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-[30px]">
                    {records
                      ? records.map((item: any, index: any) => (
                          <Talent
                            src={
                              item.fields.Pictures
                                ? item.fields.Pictures?.split(",")?.[0]
                                : ""
                            }
                            name={item.fields.Name}
                            location={`${item.fields.City}, ${item.fields.State}`}
                            key={index}
                            id={item.id}
                            handleClick={handleAddTalent}
                            rating={item.fields.Rating}
                          />
                        ))
                      : ""}
                  </div>
                  <div className="flex flex-row justify-between mt-[30px]">
                    <div className="w-[100px]">
                      <Select
                        variant="bordered"
                        selectedKeys={pageSize}
                        size="sm"
                        onSelectionChange={setPageSize as any}
                      >
                        <SelectItem key={10} value="10">
                          10
                        </SelectItem>
                        <SelectItem key={20} value="20">
                          20
                        </SelectItem>
                        <SelectItem key={50} value="50">
                          50
                        </SelectItem>
                        <SelectItem key={100} value="100">
                          100
                        </SelectItem>
                      </Select>
                    </div>
                    <Pagination
                      offsetArr={offsetArr}
                      handleClick={handlePagenation}
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                    />
                  </div>
                </div>
              </div>
              <button
                className="fixed bottom-10 right-10 bg-white pt-[8px] w-[60px] h-[60px] primary-shadow rounded-full  md:hidden"
                onClick={() => setFilterHidden(!filterHidden)}
              >
                <FontAwesomeIcon icon={faFilter} className="h-[30px] my-auto" />
              </button>
            </div>
            <div className="flex flex-row justify-between pt-5">
            <button
                    className="bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300 mb-3 w-[50%]"
                    onClick={() => handleAllAddTalent()}
                  >
                    Add all Talents
                  </button>
              <button
                className=" px-5 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300"
                onClick={() => onOpenChange()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        placement="auto"
        size="lg"
        onOpenChange={onOpenChange}
      >
        <ModalContent className=" max-h-screen overflow-y-auto">
          {(onClose) => (
            <>
              <ModalBody >
                <div className="w-full py-3 ">
                  <p className="font-bold">Talent list</p>
                  <div className="flex flex-col gap-[10px]">
                    <div className="grid grid-cols-2 gap-1 mt-5">
                      {talentPending?.map((item: any, index: number) => (
                        <div
                          className="flex flex-row gap-1 justify-between"
                          key={"pending" + index}
                        >
                          <Avatar
                            src={item?.url}
                            name={
                              item?.name || item?.fields?.["TALENT FULL NAME"]
                            }
                          />
                          <p className="my-auto">
                            {item?.name || item?.fields?.["TALENT FULL NAME"]}
                          </p>
                          <Button
                            isIconOnly
                            color="danger"
                            variant="bordered"
                            size="sm"
                            className="bg-white my-auto"
                            onClick={() => handleDelete(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-row justify-between">
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onClick={handleSubmit}>
                        Add talent to this job
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* <Modal
        isOpen={isOpen}
        placement="auto"
        size="full"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalBody>
                <div className="w-full h-[calc(100vh-100px)] py-3 overflow-y-auto ">
                  <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
                    {data ? data["TALENT FIRST NAME"] : ""}'s Profile
                  </p>
                  <div className="flex flex-col gap-[30px]">
                    <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
                      <div className="bg-primary  rounded-2xl overflow-hidden">
                        <img
                          src="/assets/images/profile-banner.png"
                          className="w-full opacity-30 h-[230px] object-cover"
                        />
                      </div>
                      <div className="flex justify-between mb-[25px] relative">
                        <div className="flex flex-row gap-[30px] ml-[280px] p-5">
                          <p className="font-bold text-[18px]">
                            {data
                              ? data["TALENT FIRST NAME"] +
                                " " +
                                data["TALENT LAST NAME"]
                              : ""}
                          </p>
                          <div className="w-[1px] h-[40px] opacity-80 mx-auto bg-[#0a0c12]"></div>
                          <div className="flex flex-col">
                            <a
                              href={`mailto:${data ? data["Email"] : ""}`}
                              className="underline text-[18px] font-bold"
                            >
                              {data ? data["Email"] : ""}
                            </a>
                          </div>
                        </div>

                        <div className="absolute translate-y-[-50%] bg-white left-[30px] rounded-3xl p-3">
                          <img
                            className="rounded-3xl w-[230px] h-[230px] object-cover object-top"
                            src={
                              data?.Pictures
                                ? data["Pictures"][0].url
                                : "/assets/images/Placeholder_view_vector.svg"
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid profile-section grid-cols-1 gap-[30px]">
                      <div
                        className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md "
                        style={{ height: "max-content" }}
                      >
                        <p className="text-[24px] font-bold mb-[10px]">
                          Talent Images
                        </p>
                        <div
                          className="grid grid-cols-3 gap-[10px] "
                          onClick={() => onOpenChange()}
                        >
                          {data
                            ? data?.Pictures?.map((item: any) => (
                                <img
                                  className="rounded-3xl object-cover aspect-square object-top"
                                  src={item.url}
                                />
                              ))
                            : ""}
                        </div>
                      </div>
                      <div className="flex flex-col gap-[10px] rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
                        <div className="flex flex-row justify-between">
                          <p className="text-[24px] font-bold mb-[10px] my-auto">
                            Personal Information
                          </p>
                        </div>
                        <div className="grid max-[1600px]:grid-cols-1 grid-cols-2 gap-[20px]">
                          <div className="flex flex-col gap-[20px]">
                            <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                              <p className="text-[#ff4081] text-[18px] font-bold">
                                Basic Information
                              </p>
                              <Information
                                label="Name:"
                                data={
                                  data
                                    ? data["TALENT FIRST NAME"] +
                                      " " +
                                      data["TALENT LAST NAME"]
                                    : ""
                                }
                              />
                              <Information
                                label="Street Address:"
                                data={data ? data["Street Address 1"] : ""}
                              />
                              <Information
                                label="City:"
                                data={data ? data["City"] : ""}
                              />
                              <Information
                                label="State:"
                                data={data ? data["State"] : ""}
                              />
                              <Information
                                label="Zip:"
                                data={data ? data["Zip"] : ""}
                              />
                              <Information
                                label="Age:"
                                data={`${data ? data["AGE"] : ""} years old`}
                              />
                              <Information
                                label="Gender:"
                                data={data ? data["Gender"] : ""}
                              />
                            </div>
                            <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                              <p className="text-[#ff4081] text-[18px] font-bold">
                                Dimensions
                              </p>
                              <Information
                                label="Height:"
                                data={data ? data["Height"] : ""}
                              />
                              <Information
                                label="Waist:"
                                data={data ? data["Waist"] : ""}
                              />
                              <Information
                                label="Hips:"
                                data={data ? data["Hips"] : ""}
                              />
                              <Information
                                label="Bust:"
                                data={data ? data["Bust"] : ""}
                              />
                              <Information
                                label="Shoe Size:"
                                data={data ? data["Shoe Size"] : ""}
                              />
                              <Information
                                label="Dress Size:"
                                data={data ? data["Dress Size"] : ""}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-[20px]">
                            <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                              <p className="text-[#ff4081] text-[18px] font-bold">
                                Attributes
                              </p>
                              <Information
                                label="Hair Color:"
                                data={data ? data["Hair Color"] : ""}
                              />
                              <Information
                                label="Eye Color:"
                                data={data ? data["Eye Color"] : ""}
                              />
                              <Information
                                label="Languages:"
                                data={data ? data?.["Languages"]?.join(", ") : ""}
                              />
                              <Information
                                label="Ethnicity:"
                                data={data ? data["Ethnicity"] : ""}
                              />
                            </div>
                            <div className="flex flex-col border-[1px] p-5 gap-[20px] rounded-lg">
                              <p className="text-[#ff4081] text-[18px] font-bold">
                                Contact Information
                              </p>
                              <Information
                                label="Cell Phone:"
                                data={data ? data["Cell Phone"] : ""}
                              />
                              <a href={`mailto:${data ? data["Email"] : ""}`}>
                                <Information
                                  label="Email:"
                                  data={data ? data["Email"] : ""}
                                  underline={true}
                                  flexwrap={true}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAddTalent}>
                  Add talent to this job
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </main>
  );
}
