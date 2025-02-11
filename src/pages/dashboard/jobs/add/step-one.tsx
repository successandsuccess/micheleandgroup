import { StepsLayout } from "@/components/Steps/StepsLayout";
import { Step } from "@/components/Steps/Step";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { EventType, FeeType, RateType, StateType } from "@/lib/selectoptions";
import { useEffect, useState } from "react";
import { Header } from "@/components/Jobs/Header";
import { Label } from "@/components/Jobs/Label";
import {
  CancellationText,
  MakeupText,
  ReferralsText,
  SocialText,
  TalentExpectationsText,
} from "@/lib/texts";
import dynamic from "next/dynamic";
import parse from "html-react-parser";
import useParticipantStore from "@/store/use-participant";
import { toast } from "react-toastify";
import { GetClientsList } from "@/actions/getClientsList";
import useJobState from "@/store/use-job";

import SelectSearch from "react-select-search";
import "react-select-search/style.css";
import { GetAccountsList } from "@/actions/getAccountsList";
import { AddLocation } from "@/actions/addLocation";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
});

const StepOne = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const { airtable_id, setDataLoading, accountType, jobErrorShown } =
    useParticipantStore((state) => state);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [locationPhone, setLocationPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [accountCity, setAccountCity] = useState("");
  const [accountZip, setAccountZip] = useState("");
  const [accountState, setAccountState] = useState<any>();
  const [premise, setPremise] = useState<any>();
  const [search, setSearch] = useState("");

  const {
    clientsList,
    accountsList,
    eventType,
    talentQuota,
    eventTitle,
    eventRef,
    eventDescription,
    eventDates,
    location,
    talentRate,
    clientRate,
    agencyFee,
    rateBasis,
    contactName,
    contactPhone,
    wardrobe,
    parking,
    makeup,
    travel,
    recap,
    social,
    additionalLocation,
    referrals,
    talentExpectations,
    cancellation,
    contacts,
    miscellaneous,
    clientAssigned,
    talentNote,
    setClientsList,
    setAccountsList,
    setEventType,
    setTalentQuota,
    setEventTitle,
    setEventRef,
    setEventDescription,
    setEventDates,
    setTalentRate,
    setClientRate,
    setAgencyFee,
    setRateBasis,
    setContactName,
    setContactPhone,
    setWardrobe,
    setParking,
    setMakeup,
    setTravel,
    setRecap,
    setSocial,
    setAdditionalLocation,
    setReferrals,
    setTalentExpectations,
    setCancellation,
    setContacts,
    setMiscellaneous,
    setClientAssigned,
    setLocation,
    setTalentNote,
  } = useJobState((state) => state);

  useEffect(() => {
    (async () => {
      if (airtable_id && clientsList.length === 0) {
        setDataLoading(true);
        const result = await GetClientsList(airtable_id, accountType);
        if (result.status === false) {
          toast.error("Please check your internet connection!");
          return;
        }
        const accounts = await GetAccountsList(search);
        const account_data = accounts.data.data;
        const temp_accounts: any = [];
        account_data?.map((item: any) => {
          temp_accounts.push({ name: item.name, value: item.id });
        });
        setAccountsList(temp_accounts);
        const data = result.data.data;
        const temp: any = [];
        data?.map((item: any) => {
          temp.push({ name: item.company, value: item.id });
        });
        setClientsList(temp);
      }
      setDataLoading(false);
    })();
  }, [airtable_id]);

  const handleStartTimeChanged = (e: any, index: number) => {
    const updatedEvent = [...eventDates];

    updatedEvent[index].startTime = e.target.value;

    setEventDates(updatedEvent);
  };

  const handleEndTimeChanged = (e: any, index: number) => {
    const updatedEvent = [...eventDates];

    updatedEvent[index].endTime = e.target.value;

    setEventDates(updatedEvent);
  };

  const handleEventDateChanged = (e: any, index: number) => {
    const updatedEvent = [...eventDates];

    updatedEvent[index].eventDate = e.target.value;

    setEventDates(updatedEvent);
  };

  const handleAddDateTime = () => {
    const newItem = {
      eventDate: `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`,
      startTime: "08:00",
      endTime: "09:00",
    };

    setEventDates([...eventDates, newItem]);
  };

  const handleDeleteDateTime = (index: number) => {
    const updatedEvents = eventDates.filter((item, i) => i !== index);

    setEventDates(updatedEvents);
  };
  const handleCellPhone = (e: any) => {
    let num = e.target.value.replace(/\D/g, "");

    setContactPhone(
      "(" +
        num.substring(0, 3) +
        ") " +
        num.substring(3, 6) +
        "-" +
        num.substring(6, 10)
    );
  };

  const handleLocationPhone = (e: any) => {
    let num = e.target.value.replace(/\D/g, "");

    setLocationPhone(
      "(" +
        num.substring(0, 3) +
        ") " +
        num.substring(3, 6) +
        "-" +
        num.substring(6, 10)
    );
  };

  const handleAddLocation = async () => {
    if (!storeName?.length) {
      toast.error("Store Name is required!");
      return;
    }
    if (!address?.length) {
      toast.error("Address is required!");
      return;
    }
    if (!accountCity?.length) {
      toast.error("City is required!");
      return;
    }
    if (!Array.from(accountState).toString()) {
      toast.error("State is required!");
      return;
    }
    if (!accountZip?.length) {
      toast.error("Zip is required!");
      return;
    }
    if (!locationPhone?.length) {
      toast.error("Phone is required!");
      return;
    }
    if (!Array.from(premise).toString()) {
      toast.error("Premise is required!");
      return;
    }
    onOpenChange();
    setDataLoading(true);
    const data = await AddLocation(
      storeName,
      address,
      accountCity,
      accountState,
      accountZip,
      locationPhone,
      premise
    );
    console.log(data);

    const updatedAccounts = [...accountsList];
    updatedAccounts.push({
      value: data.data.records[0].id,
      name: data.data.records[0].fields["Combined W/ Name"],
    });
    setAccountsList(updatedAccounts);
    setLocation(data.data.records[0].id);
    setDataLoading(false);
  };

  const handleGetAccountList = async (e: any) => {
    if (e.key === "Enter") {
      setDataLoading(true);
      const accounts = await GetAccountsList(search);
      const account_data = accounts.data.data;
      const temp_accounts: any = [];
      account_data?.map((item: any) => {
        temp_accounts.push({ name: item.name, value: item.id });
      });
      setAccountsList(temp_accounts);
      setDataLoading(false);
    }
  };

  return (
    <StepsLayout>
      <Step back="/" next="/dashboard/jobs/add/step-two">
        <div className="flex flex-col gap-4">
          <Header text="Basic Event Information" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              variant="bordered"
              label="Event Type"
              size="lg"
              selectedKeys={eventType}
              isRequired
              onSelectionChange={setEventType as any}
            >
              {EventType.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              type="number"
              variant="bordered"
              className="w-full"
              label="Talent Quota"
              isRequired
              size="lg"
              min={1}
              max={100}
              value={talentQuota}
              onChange={(e) => setTalentQuota(e.target.value)}
            />
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="Event Title"
              isRequired
              size="lg"
              value={eventTitle}
              isInvalid={eventTitle || !jobErrorShown ? false : true}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="Event Reference #"
              size="lg"
              value={eventRef}
              onChange={(e) => setEventRef(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Event Description" isRequired />
            <div
              className={`border-[2px] rounded-lg py-1  ${
                eventDescription || !jobErrorShown
                  ? "border-[#eee]"
                  : "border-[#ff2d55]"
              }`}
            >
              <QuillNoSSRWrapper
                className={`w-full bg-white h-[200px] mb-[40px] `}
                theme="snow"
                value={eventDescription}
                onChange={setEventDescription}
              />
            </div>
          </div>

          <Header text="Event Date & Time" />
          {/* <Select
            variant="bordered"
            label="Required to attend all days?"
            size="lg"
            selectedKeys={requiredAttendDay}
            isRequired
            onSelectionChange={setRequiredAttendDay as any}
          >
            {["Yes", "No"].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </Select> */}
          <table>
            <thead>
              <tr>
                <th className="text-left">
                  Event Date<span className="text-[#ff0000]">*</span>
                </th>
                <th className="text-left">
                  Start Time<span className="text-[#ff0000]">*</span>
                </th>
                <th className="text-left">
                  End Time<span className="text-[#ff0000]">*</span>
                </th>
                {/* <th className="text-left">Delete</th> */}
              </tr>
            </thead>
            <tbody>
              {eventDates.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      className="w-full outline-none border-[2px] rounded-md p-3"
                      type="date"
                      value={item.eventDate}
                      onChange={(e) => handleEventDateChanged(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      className="w-full outline-none border-[2px] rounded-md p-3"
                      type="time"
                      value={item.startTime}
                      onChange={(e) => handleStartTimeChanged(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      className="w-full outline-none border-[2px] rounded-md p-3"
                      type="time"
                      value={item.endTime}
                      onChange={(e) => handleEndTimeChanged(e, index)}
                    />
                  </td>
                  {/* <td>
                    <Button
                      color="danger"
                      isDisabled={index === 0 ? true : false}
                      onClick={() => handleDeleteDateTime(index)}
                    >
                      Delete
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          {/* <div>
            <Button color="primary" onClick={handleAddDateTime}>
              Add Date & Time
            </Button>
          </div> */}
          <Header text="Event Location" />
          <div className="flex flex-row gap-5">
            <Input
              type="text"
              variant="bordered"
              className="w-full"
              label="Location Search"
              isRequired
              size="sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyDown={handleGetAccountList}
            />
            <Button color="primary" onClick={() => onOpenChange()}>
              Add New Location
            </Button>
          </div>
          <div
            className={`border-[2px] rounded-xl py-1  ${
              location || !jobErrorShown ? "border-[#eee]" : "border-[#ff2d55]"
            }`}
          >
            <SelectSearch
              options={accountsList}
              value={location}
              onChange={(e) => {
                console.log(e);
                setLocation(e.toString());
              }}
              search={true}
              placeholder="Choose Location *"
              onBlur={() => {}}
              onFocus={() => {}}
            />
          </div>
          {/* <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Address 1"
            isRequired
            size="lg"
            value={address1}
            isInvalid={address1 || !jobErrorShown ? false : true}
            onChange={(e) => setAddress1(e.target.value)}
          />
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Address 2"
            size="lg"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
          />
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="City"
            isRequired
            size="lg"
            value={city}
            isInvalid={city || !jobErrorShown ? false : true}
            onChange={(e) => setCity(e.target.value)}
          />
          <Select
            variant="bordered"
            label="State / Province / Region"
            size="lg"
            selectedKeys={state}
            isRequired
            onSelectionChange={setState as any}
          >
            {StateType.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Zip / Postal Code"
            isRequired
            size="lg"
            value={zip}
            isInvalid={zip || !jobErrorShown? false : true}
            onChange={(e) => setZip(e.target.value)}
          /> */}
          <Header text="Rate Information" />
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Talent Rate"
            isRequired
            size="lg"
            placeholder="$"
            value={talentRate}
            isInvalid={talentRate || !jobErrorShown ? false : true}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) setTalentRate(e.target.value);
            }}
          />
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Client Rate"
            isRequired
            size="lg"
            placeholder="$"
            value={clientRate}
            isInvalid={clientRate || !jobErrorShown ? false : true}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) setClientRate(e.target.value);
            }}
          />
          <Select
            variant="bordered"
            label="Agency Fee"
            size="lg"
            selectedKeys={agencyFee}
            isRequired
            onSelectionChange={setAgencyFee as any}
          >
            {FeeType.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          <Select
            variant="bordered"
            label="Rate Basis"
            size="lg"
            selectedKeys={rateBasis}
            isRequired
            onSelectionChange={setRateBasis as any}
          >
            {RateType.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          <Header text="Contact Information" />
          <div
            className={`border-[2px] rounded-xl py-1  ${
              clientAssigned || !jobErrorShown
                ? "border-[#eee]"
                : "border-[#ff2d55]"
            }`}
          >
            <SelectSearch
              onBlur={() => {}}
              onFocus={() => {}}
              options={clientsList}
              value={clientAssigned}
              onChange={(e) => setClientAssigned(e.toString())}
              search
              placeholder="Choose your client *"
            />
          </div>
          {/* <Select
            variant="bordered"
            label="Client Assigned"
            size="lg"
            selectedKeys={clientAssigned}
            isRequired
            onSelectionChange={setClientAssigned as any}
            showScrollIndicators={true}
          >
            {clientsList?.map((item: any, index: number) => (
              <SelectItem key={item?.id || index} value={item.id || index}>
                {item?.company || ""}
              </SelectItem>
            ))}
          </Select> */}
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Onsite Contact Name"
            isRequired
            size="lg"
            value={contactName}
            isInvalid={contactName || !jobErrorShown ? false : true}
            onChange={(e) => setContactName(e.target.value)}
          />
          <Input
            type="text"
            variant="bordered"
            className="w-full"
            label="Onsite Contact Phone"
            isRequired
            size="lg"
            value={contactPhone}
            isInvalid={contactPhone || !jobErrorShown ? false : true}
            onChange={handleCellPhone}
          />
          <Header text="Important Instructions" />
          <div className="flex flex-col gap-2">
            <Label text="Wardrobe" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={wardrobe}
                onChange={setWardrobe}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Parking" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={parking}
                onChange={setParking}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Makeup & Hair" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={makeup}
                onChange={setMakeup}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Travel" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={travel}
                onChange={setTravel}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Recap Requirements" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={recap}
                onChange={setRecap}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Social Media" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={social}
                onChange={setSocial}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="CRAWL BREAKDOWN" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={additionalLocation}
                onChange={setAdditionalLocation}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Referrals" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={referrals}
                onChange={setReferrals}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Talent Expectations" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={talentExpectations}
                onChange={setTalentExpectations}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Cancellation" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={cancellation}
                onChange={setCancellation}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Contacts" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={contacts}
                onChange={setContacts}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Miscellaneous Instructions" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={miscellaneous}
                onChange={setMiscellaneous}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label text="Talent Note" />
            <div className="py-1 rounded-xl border-[2px] border-[#eee]">
              <QuillNoSSRWrapper
                className="w-full bg-white h-[200px] mb-[40px]"
                theme="snow"
                value={talentNote}
                onChange={setTalentNote}
              />
            </div>
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          placement="auto"
          size="lg"
          onOpenChange={onOpenChange}
        >
          <ModalContent className="">
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="w-full py-3 ">
                    <p className="font-bold">Add New Location</p>
                    <div className="flex flex-col gap-[10px]">
                      {/* Section1 */}

                      <div className="bg-white rounded-3xl p-3 flex flex-col gap-3">
                        <Input
                          type="text"
                          variant="bordered"
                          className="w-full"
                          label="Store Name"
                          isRequired
                          size="lg"
                          value={storeName}
                          onChange={(e) => {
                            setStoreName(e.target.value);
                          }}
                        />
                        <Input
                          type="text"
                          variant="bordered"
                          className="w-full"
                          label="Address"
                          isRequired
                          size="lg"
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                          }}
                        />
                        <Input
                          type="text"
                          variant="bordered"
                          className="w-full"
                          label="City"
                          isRequired
                          size="lg"
                          value={accountCity}
                          onChange={(e) => {
                            setAccountCity(e.target.value);
                          }}
                        />
                        <Select
                          variant="bordered"
                          label="State"
                          size="lg"
                          selectedKeys={accountState}
                          isRequired
                          onSelectionChange={setAccountState as any}
                        >
                          {StateType.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </Select>
                        <Input
                          type="text"
                          variant="bordered"
                          className="w-full"
                          label="Zip"
                          isRequired
                          size="lg"
                          value={accountZip}
                          onChange={(e) => {
                            setAccountZip(e.target.value);
                          }}
                        />
                        <Input
                          type="text"
                          variant="bordered"
                          className="w-full"
                          label="Phone"
                          isRequired
                          size="lg"
                          value={locationPhone}
                          onChange={handleLocationPhone}
                        />
                        <Select
                          variant="bordered"
                          label="On or Off Premise"
                          size="lg"
                          selectedKeys={premise}
                          isRequired
                          onSelectionChange={setPremise as any}
                        >
                          {["On Premise", "Off Premise"].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="flex flex-row justify-between">
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Close
                        </Button>
                        <Button color="primary" onClick={handleAddLocation}>
                          Add Location
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
      </Step>
    </StepsLayout>
  );
};

export default StepOne;
