import { EditAccountInfo } from "@/actions/editAccount";
import { GetAccountInformation } from "@/actions/getAccountInformation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditAccount() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [previousEmail, setPreviousEmail] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const result = await GetAccountInformation(airtable_id, accountType);
        if (result.status === false) {
          toast.error("Please check your internet connection!");
          return;
        }
        const data = result.data.data;
        console.log(data);
          if (accountType === "talent" && data?.fields) {
            setFirstName(data?.fields["TALENT FULL NAME"].split(" ")[0]);
            setLastName(data?.fields["TALENT FULL NAME"].split(" ")[1]);
            setEmail(data?.fields["Email"]);
            setPreviousEmail(data?.fields["Email"]);
            setCellPhone(data?.fields["Cell Phone"]);
          }
          if (accountType === "booker" && result?.data?.fields) {
            const bookerdata = result.data;
            setFirstName(bookerdata?.fields["Name"]?.split(" ")[0]);
            setLastName(bookerdata?.fields["Name"]?.split(" ")[1]);
            setEmail(bookerdata?.fields["Email"]);
            setPreviousEmail(bookerdata?.fields["Email"]);
            setCellPhone(bookerdata?.fields["Cell Phone"]);
          }
        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      toast.error("Type your password correctly!");
      return;
    }
    if (firstName.length === 0) {
      toast.error("First name is required!");
      return;
    }
    if (lastName.length === 0) {
      toast.error("Last name is required!");
      return;
    }
    if (email.length === 0) {
      toast.error("Email is required!");
      return;
    }
    const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

    if (phonePattern.test(cellPhone) === false) {
      toast.error("Phone number is incorrect!");
      return;
    }
    setDataLoading(true);
    const result: any = await EditAccountInfo(
      airtable_id,
      accountType,
      firstName,
      lastName,
      email,
      previousEmail,
      cellPhone,
      password
    );
    if (result.status === true) toast.success(result.data.message);
    else toast.error(result.data.message);
    setDataLoading(false);
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
          Change Password
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Change Password</p>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Input
                type="password"
                variant="bordered"
                className="w-full"
                label="Password"
                placeholder="Type your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
              />
              <Input
                type="password"
                variant="bordered"
                className="w-full"
                label="Confirm Password"
                placeholder="Type confirm Password"
                size="lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {/* <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[18px] font-bold">Basic Information</p>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-[30px] mt-[30px]">
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="First Name"
                isRequired
                size="lg"
                placeholder="Type your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Last Name"
                isRequired
                placeholder="Type your last name"
                value={lastName}
                size="lg"
                onChange={(e) => setLastName(e.target.value)}
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
                value={email}
                size="lg"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Cell Phone"
                isRequired
                placeholder="Type your phone number"
                value={cellPhone}
                onChange={handleCellPhone}
                size="lg"
              />
            </div>
            
          </div> */}
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
