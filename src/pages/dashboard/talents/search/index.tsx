import { SearchTalent } from "@/actions/searchTalent";
import { Pagination } from "@/components/Pagination";
import SearchCard from "@/components/SearchCard";
import Sidebar from "@/components/Sidebar";
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
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
  Slider,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Home() {
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

  const [fromHeight, setFromHeight] = useState(new Set<string>([`1' 0"`]));
  const [toHeight, setToHeight] = useState(new Set<string>([`6' 11"`]));

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

  const [zipCode, setZipCode] = useState("");
  const [distance, setDistance] = useState(0);

  const [filterHidden, setFilterHidden] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<any>(
    new Set(["JOB INFORMATION"])
  );

  const [state, setState] = useState(new Set<string>([`ALL`]));
  const [rating, setRating] = useState(new Set<string>([]));
  const [status, setStatus] = useState(new Set<string>([]));

  useEffect(() => {
    (async () => {
      if (airtable_id && pageSize) {
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
        setPageIndex(0);
        setOffsetArr(["", result.data.offset]);
        setRecords(result.data.records);
        setDataLoading(false);
      }
    })();
  }, [airtable_id, pageSize, tags, bookings, distance, state, rating, status, language]);

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

  useEffect(() => {
    console.log(offsetArr);
  }, [offsetArr]);

  const handlePagenation = async (index: any) => {
    console.log(index);
    if (index < 0) return;
    if (pageIndex === index) return;
    setDataLoading(true);

    console.log(offsetArr[index]);
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

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      await handleSearch();
    }
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Search Talent
        </p>
        <div className="flex flex-col gap-[30px]">
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
            <div className="grid md:grid-cols-2 grid-cols-1">
              <button
                className="font-bold text-[16px] py-[12px] px-[16px] text-black bg-primary hover:bg-primarylight transition rounded-xl"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            <div className="">
              <div className="grid lg:grid-cols-3 2xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-[30px]">
                {records
                  ? records.map((item: any, index: any) => (
                      <SearchCard
                        src={
                          item.fields.Pictures
                            ? item.fields.Pictures?.split(",")?.[0]
                            : ""
                        }
                        name={item.fields.Name}
                        location={`${item.fields.City}, ${item.fields.State}`}
                        key={index}
                        id={item.id}
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
        </div>
      </div>
      <button
        className="fixed bottom-10 right-10 bg-white pt-[8px] w-[60px] h-[60px] primary-shadow rounded-full md:hidden"
        onClick={() => setFilterHidden(!filterHidden)}
      >
        <FontAwesomeIcon icon={faFilter} className="h-[30px] my-auto " />
      </button>
    </main>
  );
}
