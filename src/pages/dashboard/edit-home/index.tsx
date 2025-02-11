import { GetHome } from "@/actions/page/getHome";
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

export default function Home() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const [header, setHeader] = useState("");
  const [subHeader, setSubHeader] = useState("");
  const [heroImage, setHeroImage] = useState("");

  const [talentDescription, setTalentDescription] = useState("");
  const [talents, setTalents] = useState<Array<any>>([]);

  const [sectionHeader, setSectionHeader] = useState("");
  const [sectionContent, setSectionContent] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const data = await GetHome();
        const hero_data = await JSON.parse(data.hero.data.fields.Data);
        setHeader(hero_data.Header);
        setSubHeader(hero_data["Sub Header"]);
        setHeroImage(hero_data["Hero Image"]);
        const talent_data = await JSON.parse(data?.talents?.data?.fields?.Data);
        const section_data = await JSON.parse(data.section.data.fields.Data);
        setSectionHeader(section_data.Header);
        setSectionContent(section_data.Content);
        setTalentDescription(talent_data.Description);
        setTalents(talent_data.talents);
        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleHeroUpdate = async () => {
    if (!header) {
      toast.error("Header is required!");
      return;
    }
    if (!subHeader) {
      toast.error("Sub Header is required!");
      return;
    }
    setDataLoading(true);
    await UpdateHero({
      Header: header,
      "Sub Header": subHeader,
      "Hero Image": heroImage,
    });
    toast.success("Hero page has been updated successfully!");
    setDataLoading(false);
  };

  const handleUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setDataLoading(true);
    console.log(file);
    const uuid = uuidv4();
    const storageRef = ref(storage, uuid + ".jpg");
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
        setHeroImage(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleTalentNameChanged = (e: any, index: number) => {
    const updatedTalents = [...talents];

    updatedTalents[index].name = e.target.value;

    setTalents(updatedTalents);
  };

  const handleTalentLinkChanged = (e: any, index: number) => {
    const updatedTalents = [...talents];

    updatedTalents[index].link = e.target.value;

    setTalents(updatedTalents);
  };


  const handleAddTalent = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setDataLoading(true);
    console.log(file);
    const uuid = uuidv4();
    const storageRef = ref(storage, uuid + ".jpg");
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
        const updatedTalents = [...talents];
        updatedTalents.push({
          image: downloadURL,
          name: "",
          link: "",
        });
        toast.success("Your image has been successfully uploaded!");
        setTalents(updatedTalents);
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleDeleteTalent = (idx: number) => {
    const updatedTalents = talents.filter(
      (item: any, index: number) => index !== idx
    );

    setTalents(updatedTalents);
  };

  const handleTalentUpdate = async () => {
    if (!talentDescription) {
      toast.error("Talent description is required!");
      return;
    }
    for (let i = 0; i < talents.length; i++) {
      if (!talents[i].name) {
        toast.error("Talent name is required!");
        return;
      }
      if(!talents[i].link) {
        toast.error('Talent link is required!');
        return;
      }
    }
    setDataLoading(true);
    await UpdateTalents({
      Description: talentDescription,
      talents: talents,
    });
    toast.success("Talents page has been updated successfully!");
    setDataLoading(false);
  };

  const handleContentImageUpload = async (event: any, index: number) => {
    const file = event.target.files[0];
    if (!file) return;
    setDataLoading(true);
    console.log(file);
    const uuid = uuidv4();
    const storageRef = ref(storage, uuid + ".jpg");
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
        const updatedContent = [...sectionContent];
        updatedContent[index].Image = downloadURL;
        toast.success("Your image has been successfully uploaded!");
        setSectionContent(updatedContent);
        setDataLoading(false);
      }
    );

    event.target.value = null;
  }

  const handleDescriptionChange = (e: any, index: number, target: boolean) => {
    const updatedContent = [...sectionContent];
    if(target) {
      updatedContent[index].SubHeader = e.target.value;
    }
    else {
      updatedContent[index].Description = e.target.value;
    }
    setSectionContent(updatedContent);
  }

  const handleSectionUpdate = async () => {
    if(!sectionHeader) {
      toast.error('Header is required!');
    }
    for(let i = 0 ; i < sectionContent.length ; i ++){
      if(!sectionContent[i].SubHeader)
      {
        toast.error('Sub Header is required!');
        return;
      }
      if(!sectionContent[i].Description)
      {
        toast.error('Sub Description is required!');
      }
    }
    setDataLoading(true);
    await UpdateSection({
      Header: sectionHeader,
      Content: sectionContent,
    })
    toast.success('The page has been updated successfully!');
    setDataLoading(false);
  }

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Edit Home
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <Tabs aria-label="Options">
              <Tab key="photos" title="Hero">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Header"
                    value={header}
                    isRequired
                    onChange={(e) => setHeader(e.target.value)}
                  />
                  <Input
                    label="Sub Header"
                    value={subHeader}
                    isRequired
                    onChange={(e) => setSubHeader(e.target.value)}
                  />
                  <div className="md:w-[50%] w-full relative">
                    <img src={heroImage} />
                    <label
                      htmlFor="fileinput"
                      className="p-2 bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                    >
                      Choose Image
                    </label>
                  </div>
                  <input
                    type="file"
                    id="fileinput"
                    className="hidden"
                    onChange={handleUpload}
                  />
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                      onClick={handleHeroUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Tab>
              <Tab key="music" title="Talents">
                <div className="flex flex-col gap-5">
                  <Textarea
                    label="Talent Description"
                    value={talentDescription}
                    isRequired
                    disableAnimation
                    disableAutosize
                    onChange={(e) => setTalentDescription(e.target.value)}
                    classNames={{
                      input: "resize-y min-h-[100px]",
                    }}
                  />
                  <div className="grid grid-cols-4 gap-5">
                    {talents?.map((item: any, index: number) => (
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
                              onChange={(e) =>
                                handleTalentNameChanged(e, index)
                              }
                            />
                            <Input
                              isRequired
                              size="sm"
                              label="Link"
                              variant="bordered"
                              value={item.link}
                              onChange={(e) =>
                                handleTalentLinkChanged(e, index)
                              }
                            />
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="absolute right-[0px] top-0 z-[10] bg-white"
                              onClick={() => handleDeleteTalent(index)}
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
                        Add Talent
                      </label>
                      <input
                        type="file"
                        id="talentsinput"
                        className="hidden"
                        onChange={handleAddTalent}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                      onClick={handleTalentUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Tab>
              <Tab key="videos" title="How does it work?">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Header"
                    isRequired
                    value={sectionHeader}
                    onChange={(e) => setSectionHeader(e.target.value)}
                  />
                  {sectionContent?.map((item: any, index: number) => (
                    <Card>
                      <CardBody>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="flex flex-col gap-5">
                            <Input
                              label="Sub Header"
                              isRequired
                              value={item.SubHeader}
                              onChange={(e) => handleDescriptionChange(e, index, true)}
                            />
                            <Textarea
                              label="Description"
                              isRequired
                              disableAnimation
                              disableAutosize
                              value={item.Description}
                              onChange={(e) => handleDescriptionChange(e, index, false)}
                              classNames={{
                                input: "resize-y min-h-[100px]",
                              }}
                            />
                          </div>
                          <div className="relative">
                            <img src={item.Image} />
                            <label
                              htmlFor={"contentImage"+index}
                              className="p-2 bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                            >
                              Choose Image
                            </label>
                            <input
                              type="file"
                              id={"contentImage" + index}
                              className="hidden"
                              onChange={(e) => handleContentImageUpload(e,index)}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                      onClick={handleSectionUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
