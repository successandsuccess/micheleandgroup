import { GetEmail } from "@/actions/page/getEmail";
import { GetHelp } from "@/actions/page/getHelp";
import { GetOffice } from "@/actions/page/getOffice";
import { GetStaff } from "@/actions/page/getStaff";
import { UpdateEmail } from "@/actions/page/updateEmail";
import { UpdateHelp } from "@/actions/page/updateHelp";
import { UpdateOffice } from "@/actions/page/updateOffice";
import { UpdateStaff } from "@/actions/page/updateStaff";
import Sidebar from "@/components/Sidebar";
import { storage } from "@/lib/firebaseclient";
import useParticipantStore from "@/store/use-participant";
import { faFileArrowUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const [emailUs, setEmailUs] = useState<Array<any>>([]);

  const [staff, setStaff] = useState<Array<any>>([]);

  const [help, setHelp] = useState<Array<any>>([]);

  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);

        const email_record = await GetEmail();
        const email_data = await JSON.parse(
          email_record?.data?.data?.fields?.Data
        );
        setEmailUs(email_data);

        const staff_record = await GetStaff();
        const staff_data = await JSON.parse(
          staff_record?.data?.data?.fields?.Data
        );
        setStaff(staff_data);

        const help_record = await GetHelp();
        const help_data = await JSON.parse(
          help_record?.data?.data?.fields?.Data
        );
        setHelp(help_data);

        const office_record = await GetOffice();
        const office_data = await JSON.parse(
          office_record?.data?.data?.fields?.Data
        );
        setPhone(office_data.Phone);
        setLocation(office_data.Location);

        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleAddEmail = () => {
    const updatedEmail = [...emailUs];

    updatedEmail.push({
      Email: "",
      Name: "",
    });

    setEmailUs(updatedEmail);
  };

  const handleEmailDelete = (index: number) => {
    const updatedEMail = emailUs.filter(
      (item: any, idx: number) => idx !== index
    );

    setEmailUs(updatedEMail);
  };

  const handleEmailChange = (e: any, index: number) => {
    const updatedEmail = [...emailUs];
    updatedEmail[index].Email = e.target.value;

    setEmailUs(updatedEmail);
  };

  const handleEmailNameChange = (e: any, index: number) => {
    const updatedEmail = [...emailUs];
    updatedEmail[index].Name = e.target.value;

    setEmailUs(updatedEmail);
  };

  const handleEmailUpdate = async () => {
    for (let i = 0; i < emailUs.length; i++) {
      if (!emailUs[i].Email) {
        toast.error("Email is required!");
        return;
      }
      if (!emailUs[i].Name) {
        toast.error("Name is required!");
        return;
      }
    }
    setDataLoading(true);
    await UpdateEmail(emailUs);
    setDataLoading(false);
  };

  const handleAddStaff = () => {
    const updatedStaff = [...staff];

    updatedStaff.push({
      Email: "",
      Name: "",
    });

    setStaff(updatedStaff);
  };

  const handleStaffDelete = (index: number) => {
    const updatedStaff = staff.filter(
      (item: any, idx: number) => idx !== index
    );

    setStaff(updatedStaff);
  };

  const handleStaffEmailChange = (e: any, index: number) => {
    const updatedStaff = [...staff];
    updatedStaff[index].Email = e.target.value;

    setStaff(updatedStaff);
  };

  const handleStaffNameChange = (e: any, index: number) => {
    const updatedStaff = [...staff];
    updatedStaff[index].Name = e.target.value;

    setStaff(updatedStaff);
  };

  const handleStaffUpdate = async () => {
    for (let i = 0; i < staff.length; i++) {
      if (!staff[i].Email) {
        toast.error("Email is required!");
        return;
      }
      if (!staff[i].Name) {
        toast.error("Name is required!");
        return;
      }
    }
    setDataLoading(true);
    await UpdateStaff(staff);
    setDataLoading(false);
  };

  const handleAddHelp = () => {
    const updatedHelp = [...help];

    updatedHelp.push({
      Email: "",
      Name: "",
    });

    setHelp(updatedHelp);
  };

  const handleHelpDelete = (index: number) => {
    const updatedHelp = help.filter(
      (item: any, idx: number) => idx !== index
    );

    setHelp(updatedHelp);
  };

  const handleHelpEmailChange = (e: any, index: number) => {
    const updatedHelp = [...help];
    updatedHelp[index].Email = e.target.value;

    setHelp(updatedHelp);
  };

  const handleHelpNameCHange = (e: any, index: number) => {
    const updatedHelp = [...help];
    updatedHelp[index].Name = e.target.value;

    setHelp(updatedHelp);
  };

  const handleHelpUpdate = async () => {
    for (let i = 0; i < help.length; i++) {
      if (!help[i].Email) {
        toast.error("Link is required!");
        return;
      }
      if (!help[i].Name) {
        toast.error("Name is required!");
        return;
      }
    }
    setDataLoading(true);
    await UpdateHelp(help);
    setDataLoading(false);
  };

  const handleOfficeUpdate = async () => {
    const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/
    
    if (phonePattern.test(phone) === false) {
      toast.error("Phone number is incorrect!");
      return;
    }

    if(!location) {
        toast.error('Location is required!');
        return;
    }
    setDataLoading(true);
    await UpdateOffice({
        Phone : phone,
        Location: location,
    })
    setDataLoading(false);
  }

  const handleCellPhone = (e : any) => {
    let num = e.target.value.replace(/\D/g, '');

    setPhone('(' + num.substring(0,3) + ') ' + num.substring(3,6) + '-' + num.substring(6,10))
  }

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Edit Contact
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <Tabs aria-label="Options">
              <Tab key="photos" title="Email Us">
                <Card>
                  <CardBody>
                    <div className="flex flex-col gap-5 mb-5">
                      {emailUs?.map((item: any, index: number) => (
                        <div
                          className="flex flex-row gap-5"
                          key={"emailus" + index}
                        >
                          <Input
                            value={item.Email}
                            isRequired
                            size="sm"
                            variant="bordered"
                            label="Email"
                            onChange={(e) => handleEmailChange(e, index)}
                          />
                          <Input
                            value={item.Name}
                            isRequired
                            size="sm"
                            variant="bordered"
                            label="Name"
                            onChange={(e) => handleEmailNameChange(e, index)}
                          />
                          <div className="py-2">
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className=" bg-white "
                              onClick={() => handleEmailDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <button
                        className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full hover:bg-opacity-50 transition"
                        onClick={handleAddEmail}
                      >
                        Add
                      </button>
                    </div>
                  </CardBody>
                </Card>
                <button
                  className="mt-5 bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full hover:bg-opacity-50 transition"
                  onClick={handleEmailUpdate}
                >
                  Update
                </button>
              </Tab>
              <Tab key="music" title="STAFF">
                <Card>
                  <CardBody>
                    <div className="flex flex-col gap-5 mb-5">
                      {staff?.map((item: any, index: number) => (
                        <div
                          className="flex flex-row gap-5"
                          key={"staff" + index}
                        >
                          <Input
                            value={item.Email}
                            isRequired
                            size="sm"
                            variant="bordered"
                            label="Email"
                            onChange={(e) => handleStaffEmailChange(e, index)}
                          />
                          <Input
                            value={item.Name}
                            isRequired
                            size="sm"
                            variant="bordered"
                            label="Name"
                            onChange={(e) => handleStaffNameChange(e, index)}
                          />
                          <div className="py-2">
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className=" bg-white "
                              onClick={() => handleStaffDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <button
                        className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full hover:bg-opacity-50 transition"
                        onClick={handleAddStaff}
                      >
                        Add
                      </button>
                    </div>
                  </CardBody>
                </Card>
                <button
                  className="mt-5 bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full hover:bg-opacity-50 transition"
                  onClick={handleStaffUpdate}
                >
                  Update
                </button>
              </Tab>
              <Tab key="videos" title="HELPFUL LINKS">
              <Card>
                  <CardBody>
                    <div className="flex flex-col gap-5 mb-5">
                      {help?.map((item: any, index: number) => (
                        <div className="flex flex-row gap-5" key={'help' + index}>
                          <Input
                            value={item.Email}
                            isRequired
                            size="sm"
                            variant="bordered"
                            label="Link"
                            onChange={(e) => handleHelpEmailChange(e, index)}
                          />
                          <Input
                            value={item.Name}
                            isRequired
                            size="sm"
                            variant="bordered"
                            label="Name"
                            onChange={(e) => handleHelpNameCHange(e, index)}
                          />
                          <div className="py-2">
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className=" bg-white "
                                onClick={() => handleHelpDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <button
                        className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full hover:bg-opacity-50 transition"
                        onClick={handleAddHelp}
                      >
                        Add
                      </button>
                    </div>
                  </CardBody>
                </Card>
                <button
                  className="mt-5 bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full hover:bg-opacity-50 transition"
                  onClick={handleHelpUpdate}
                >
                  Update
                </button>
              </Tab>
              <Tab key="office" title="CORPORATE OFFICE">
              <Card>
                  <CardBody>
                    <div className="flex flex-col gap-5 mb-5">
                          <Input
                            value={phone}
                            isRequired
                            size="sm"
                            variant="bordered"
                            label="Phone"
                            onChange={handleCellPhone}
                          />
                          <Input
                            value={location}
                            isRequired
                            size="sm"
                            variant="bordered"
                            label="Location"
                            onChange={(e) => setLocation(e.target.value)}
                          />
                          
                        </div>
                  </CardBody>
                </Card>
                <button
                  className="mt-5 bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full hover:bg-opacity-50 transition"
                  onClick={handleOfficeUpdate}
                >
                  Update
                </button>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
