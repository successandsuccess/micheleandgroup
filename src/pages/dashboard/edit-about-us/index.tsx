import { GetAbout } from "@/actions/page/getAbout";
import { GetHome } from "@/actions/page/getHome";
import { UpdateAbout } from "@/actions/page/updateAbout";
import { UpdateHero } from "@/actions/page/updateHero";
import { UpdateSection } from "@/actions/page/updateSection";
import { UpdateTalents } from "@/actions/page/updateTalents";
import { SubHeader } from "@/components/Jobs/SubHeader";
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function Home() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const [description, setDescription] = useState("");
  const [brands, setBrands] = useState<Array<string>>([]);
  const [staff, setStaff] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const data = await GetAbout();
        const about_data = await JSON.parse(data.data.data.fields.Data);
        setDescription(about_data.Description);
        setBrands(about_data.Brands);
        setStaff(about_data.Staffs);
        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleAddBrand = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setDataLoading(true);
    console.log(file);
    const uuid = uuidv4();
    const storageRef = ref(storage, uuid);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: any) => {},
      (error) => {
        setDataLoading(false);
        toast.error("Upload failed!");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const updatedBrands = [...brands];
        updatedBrands.push(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setBrands(updatedBrands);
        setDataLoading(false);
      }
    );

    event.target.value = null;
  };

  const handleUpdate = async () => {
    if (!description) {
      toast.error("Description is required!");
      return;
    }
    for (let i = 0; i < staff.length; i++) {
      if (!staff[i].name) {
        toast.error("Staff name is required!");
        return;
      }
      if (!staff[i].description) {
        toast.error("Staff bio is required!");
        return;
      }
    }
    setDataLoading(true);
    await UpdateAbout({
      Description: description,
      Brands: brands,
      Staffs: staff,
    });
    toast.success("Page has been updated successfully!");
    setDataLoading(false);
  };

  const handleDelete = (idx: number) => {
    const updatedBrands = brands.filter(
      (item: any, index: number) => index !== idx
    );

    setBrands(updatedBrands);
  };

  const handleAddStaff = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setDataLoading(true);
    console.log(file);
    const uuid = uuidv4();
    const storageRef = ref(storage, uuid);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: any) => {},
      (error) => {
        setDataLoading(false);
        toast.error("Upload failed!");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const updatedBrands = [...staff];
        updatedBrands.push({
          image: downloadURL,
          name: "",
          description: "",
        });
        toast.success("Your image has been successfully uploaded!");
        setStaff(updatedBrands);
        setDataLoading(false);
      }
    );
  };

  const handleDeleteStaff = (idx: number) => {
    const updatedStaff = staff.filter(
      (item: any, index: number) => idx !== index
    );

    setStaff(updatedStaff);
  };

  const handleStaffNameChanged = (e: any, index: number) => {
    const updatedStaff = [...staff];

    updatedStaff[index].name = e.target.value;

    setStaff(updatedStaff);
  };

  const handleStaffBioChanged = (e: any, index: number) => {
    const updatedStaff = [...staff];

    updatedStaff[index].description = e.target.value;

    setStaff(updatedStaff);
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Edit About Us
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <div className="flex flex-col gap-5">
              <div className={`border-[2px] rounded-lg py-1 `}>
                <QuillNoSSRWrapper
                  className={`w-full bg-white h-[200px] mb-[40px] `}
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                />
              </div>
              <div className="grid grid-cols-4 gap-5">
                {brands?.map((item: string, index: number) => (
                  <Card key={"talents" + index}>
                    <CardBody>
                      <div className="relative flex flex-col gap-5 justify-center">
                        <img src={item} className="rounded-lg my-auto" />
                        <Button
                          isIconOnly
                          color="danger"
                          variant="bordered"
                          size="sm"
                          className="absolute right-[0px] top-0 z-[10] bg-white"
                          onClick={() => handleDelete(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
                <div className="relative min-h-10">
                  <label
                    htmlFor="brandinput"
                    className="p-2 bg-primary w-full text-center text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                  >
                    Add Brand
                  </label>
                  <input
                    type="file"
                    id="brandinput"
                    className="hidden"
                    onChange={handleAddBrand}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-5">
                {staff?.map((item: any, index: number) => (
                  <Card key={"talents" + index}>
                    <CardBody>
                      <div className="relative flex flex-col gap-5">
                        <img src={item.image} className="rounded-lg" />
                        <Input
                          isRequired
                          size="sm"
                          label="Name"
                          variant="bordered"
                          value={item.name}
                          onChange={(e) => handleStaffNameChanged(e, index)}
                        />
                        <Textarea
                          label="Bio"
                          isRequired
                          disableAnimation
                          disableAutosize
                          value={item.description}
                          onChange={(e) => handleStaffBioChanged(e, index)}
                          classNames={{
                            input: "resize-y min-h-[100px]",
                          }}
                        />
                        <Button
                          isIconOnly
                          color="danger"
                          variant="bordered"
                          size="sm"
                          className="absolute right-[0px] top-0 z-[10] bg-white"
                          onClick={() => handleDeleteStaff(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
                <div className="relative min-h-10">
                  <label
                    htmlFor="talentsinput"
                    className="p-2 bg-primary w-full text-center text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                  >
                    Add Staff
                  </label>
                  <input
                    type="file"
                    id="talentsinput"
                    className="hidden"
                    onChange={handleAddStaff}
                  />
                </div>
              </div>
              <div>
                <button
                  className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
