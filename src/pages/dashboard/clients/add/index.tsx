import { GetAccountInformation } from "@/actions/getAccountInformation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Gender,
  StateType,
} from "@/lib/selectoptions";
import { EditProfile } from "@/actions/updateProfile";
import { useRouter } from "next/router";
import { AddTalent } from "@/actions/addTalent";
import { AddClient } from "@/actions/addClient";
import { GetBookersList } from "@/actions/getBookersList";

export default function EditAccountbyid() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
  const router = useRouter();

  const [name, setName] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(new Set<string>(['Florida']));
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");
  const [cellPhone, setCellPhone] = useState("");

  const [errorShown, setErrorShown] = useState(false);
  const [fax, setFax] = useState("");

  const [contactName1, setContactName1] = useState("");
  const [contactPhone1, setContactPhone1] = useState("");

  const [contactName2, setContactName2] = useState("");
  const [contactPhone2, setContactPhone2] = useState("");

  const [booker, setBooker] = useState();
  
  const [bookers, setBookers] = useState<any>([]);

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const result = await GetBookersList();
        console.log(result);
        const booker_list: any = [];
        result.data.data.records.map((item: any) => {
          booker_list.push({ id: item.id, name: item.fields.Name });
        });
        setBookers(booker_list);
        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleUpdate = async () => {
    setErrorShown(true);
    if (name.length === 0) {
      window.scrollTo(0, 0);
      toast.error("Name is required!");
      return;
    }
    if (!booker) {
      window.scrollTo(0, 0);
      toast.error("Booker is required!");
      return;
    }
    if (street1.length === 0) {
      window.scrollTo(0, 0);
      toast.error("Address1 is required!");
      return;
    }
    if (city.length === 0) {
      window.scrollTo(0, 0);
      toast.error("City is required!");
      return;
    }
    if (zip.length === 0) {
      window.scrollTo(0, 0);
      toast.error("Zip is required!");
      return;
    }
    

    if (phonePattern.test(contactPhone1) === false && !contactPhone1) {
      // window.scrollTo(0,0);
      toast.error("Phone number is incorrect!");
      return;
    }

    if (phonePattern.test(contactPhone2) === false && !contactPhone2) {
      // window.scrollTo(0,0);
      toast.error("Phone number is incorrect!");
      return;
    }

    if (email.length === 0) {
      toast.error("Email is required!");
      // window.scrollTo(0,0);
      return;
    }
    const result = await AddClient(
      name,
      email,
      fax,
      booker,
      street1,
      street2,
      city,
      state,
      zip,
      contactName1,
      contactPhone1,
      contactName2,
      contactPhone2
    );
    if (result.status === true) toast.success(result.data.message);
    else toast.error(result.data.message);
  };

  const handlePhone1 = (e: any) => {
    let num = e.target.value.replace(/\D/g, "");

    setContactPhone1(
      "(" +
        num.substring(0, 3) +
        ") " +
        num.substring(3, 6) +
        "-" +
        num.substring(6, 10)
    );
  };

  const handlePhone2 = (e: any) => {
    let num = e.target.value.replace(/\D/g, "");

    setContactPhone2(
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
          Add Client Profile
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Basic Information</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Company Name"
                size="lg"
                value={name}
                isRequired
                isInvalid={name || !errorShown ? false : true}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Email"
                size="lg"
                value={email}
                isRequired
                isInvalid={email || !errorShown ? false : true}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Fax"
                size="lg"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
              />
              <Select
                variant="bordered"
                label="Assigned To"
                size="lg"
                selectedKeys={booker}
                isInvalid={booker || !errorShown ? false : true}
                onSelectionChange={setBooker as any}
                isRequired
              >
                {bookers?.map((item:any) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Address</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Address 1"
                isRequired
                size="lg"
                value={street1}
                isInvalid={street1 || !errorShown ? false : true}
                onChange={(e) => setStreet1(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Address 2"
                size="lg"
                value={street2}
                onChange={(e) => setStreet2(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="City"
                isRequired
                size="lg"
                value={city}
                isInvalid={city || !errorShown ? false : true}
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
                isInvalid={zip || !errorShown ? false : true}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          </div>

          {/* Section 3 */}

          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">First Contact</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Contact Name"
                size="lg"
                value={contactName1}
                onChange={(e) => setContactName1(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Contact Phone"
                size="lg"
                value={contactPhone1}
                isInvalid={phonePattern.test(contactPhone1) || !errorShown|| !contactPhone1 ? false : true}
                onChange={handlePhone1}
              />
            </div>
          </div>

          {/* Section 3 */}

          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Second Contact</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Contact Name"
                size="lg"
                value={contactName2}
                onChange={(e) => setContactName2(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Contact Phone"
                size="lg"
                value={contactPhone2}
                isInvalid={phonePattern.test(contactPhone2) || !errorShown || !contactPhone2 ? false : true}
                onChange={handlePhone2}
              />
            </div>
          </div>
        </div>
        <button
          className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full mt-[40px]"
          onClick={handleUpdate}
        >
          Add Client
        </button>
      </div>
    </main>
  );
}
