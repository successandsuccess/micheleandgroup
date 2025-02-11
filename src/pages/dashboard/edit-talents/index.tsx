import { GetChild } from "@/actions/page/getChild";
import { GetFemale } from "@/actions/page/getFemale";
import { GetHome } from "@/actions/page/getHome";
import { GetLife } from "@/actions/page/getLife";
import { GetMake } from "@/actions/page/getMake";
import { GetMale } from "@/actions/page/getMale";
import { GetPhoto } from "@/actions/page/getPhoto";
import { GetPro } from "@/actions/page/getPro";
import { UpdateChild } from "@/actions/page/updateChild";
import { UpdateFemale } from "@/actions/page/updateFemale";
import { UpdateHero } from "@/actions/page/updateHero";
import { UpdateLife } from "@/actions/page/updateLife";
import { UpdateMake } from "@/actions/page/updateMake";
import { UpdateMale } from "@/actions/page/updateMale";
import { UpdatePhoto } from "@/actions/page/updatePhoto";
import { UpdatePro } from "@/actions/page/updatePro";
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
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function Home() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const [maleDescription, setMaleDescription] = useState("");
  const [maleTalents, setMaleTalents] = useState<Array<string>>([]);
  const [maleModel, setMaleModel] = useState("");
  const [maleHeader, setMaleHeader] = useState("");

  const [femaleDescription, setFeMaleDescription] = useState("");
  const [femaleTalents, setFeMaleTalents] = useState<Array<string>>([]);
  const [femaleModel, setFeMaleModel] = useState("");
  const [femaleHeader, setFeMaleHeader] = useState("");

  const [childDescription, setChildDescription] = useState("");
  const [childTalents, setChildTalent] = useState<Array<string>>([]);
  const [childModel, setChildModel] = useState("");
  const [childHeader, setChildHeader] = useState("");

  const [proDescription, setProDescription] = useState("");
  const [proTalents, setProTalent] = useState<Array<string>>([]);
  const [proModel, setProModel] = useState("");
  const [proHeader, setProHeader] = useState("");

  const [lifeDescription, setLifeDescription] = useState("");
  const [lifeTalents, setLifeTalent] = useState<Array<string>>([]);
  const [lifeModel, setLifeModel] = useState("");
  const [lifeHeader, setLifeHeader] = useState("");

  const [photoDescription, setPhotoDescription] = useState("");
  const [photoTalents, setPhotoTalent] = useState<Array<string>>([]);
  const [photoModel, setPhotoModel] = useState("");
  const [photoHeader, setPhotoHeader] = useState("");

  const [makeDescription, setMakeDescription] = useState("");
  const [makeTalents, setMakeTalents] = useState<Array<string>>([]);
  const [makeModel, setMakeModel] = useState("");
  const [makeHeader, setMakeHeader] = useState("");

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const male_record = await GetMale();
        const male_data = await JSON.parse(male_record?.data?.data?.fields?.Data);
        setMaleDescription(male_data.Description);
        setMaleTalents(male_data.Image);
        setMaleHeader(male_data.Header);
        setMaleModel(male_data.Model);

        const female_record = await GetFemale();
        const female_data = await JSON.parse(female_record?.data?.data?.fields?.Data);
        setFeMaleDescription(female_data.Description);
        setFeMaleTalents(female_data.Image);
        setFeMaleHeader(female_data.Header);
        setFeMaleModel(female_data.Model);

        const child_record = await GetChild();
        const child_data = await JSON.parse(child_record?.data?.data?.fields?.Data);
        setChildDescription(child_data.Description);
        setChildTalent(child_data.Image);
        setChildHeader(child_data.Header);
        setChildModel(child_data.Model);

        const pro_record = await GetPro();
        const pro_data = await JSON.parse(pro_record?.data?.data?.fields?.Data);
        setProDescription(child_data.Description);
        setProTalent(pro_data.Image);
        setProHeader(pro_data.Header);
        setProModel(pro_data.Model);

        const life_record = await GetLife();
        const life_data = await JSON.parse(life_record?.data?.data?.fields?.Data);
        setLifeDescription(life_data.Description);
        setLifeTalent(life_data.Image);
        setLifeHeader(life_data.Header);
        setLifeModel(life_data.Model);

        const photo_record = await GetPhoto();
        const photo_data = await JSON.parse(photo_record?.data?.data?.fields?.Data);
        setPhotoDescription(photo_data.Description);
        setPhotoTalent(photo_data.Image);
        setPhotoHeader(photo_data.Header);
        setPhotoModel(photo_data.Model);

        const make_record = await GetMake();
        const make_data = await JSON.parse(make_record?.data?.data?.fields?.Data);
        setMakeDescription(make_data.Description);
        setMakeTalents(make_data.Image);
        setMakeHeader(make_data.Header);
        setMakeModel(make_data.Model);

        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleMaleDelete = (idx: number) => {
    const updatedTalents = maleTalents.filter((item: any, index : number) => index !== idx);

    setMaleTalents(updatedTalents)
  };

  const handleAddMale = async (event: any) => {
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
        const updatedTalents = [...maleTalents];
        updatedTalents.push(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setMaleTalents(updatedTalents);
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleMaleModelUpload = async (event: any) => {
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
        setMaleModel(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleMaleUpdate = async () => {
    if(!maleHeader) {
      toast.error("Header is required!");
      return;
    }
    if(!maleDescription) {
      toast.error('Description is required!');
      return;
    }
    setDataLoading(true);
    await UpdateMale({
      Description: maleDescription,
      Image: maleTalents,
      Header: maleHeader,
      Model: maleModel
    })
    setDataLoading(false);
  }

  const handleFemaleDelete = (idx: number) => {
    const updatedTalents = femaleTalents.filter((item: any, index : number) => index !== idx);

    setFeMaleTalents(updatedTalents)
  };

  const handleAddFemale = async (event: any) => {
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
        const updatedTalents = [...femaleTalents];
        updatedTalents.push(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setFeMaleTalents(updatedTalents);
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleFemaleModelUpload = async (event: any) => {
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
        setFeMaleModel(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleFemaleUpdate = async () => {
    if(!femaleHeader) {
      toast.error("Header is required!");
      return;
    }
    if(!femaleDescription) {
      toast.error('Description is required!');
      return;
    }
    setDataLoading(true);
    await UpdateFemale({
      Description: femaleDescription,
      Image: femaleTalents,
      Header: femaleHeader,
      Model: femaleModel
    })
    setDataLoading(false);
  }

  const handleChildDelete = (idx: number) => {
    const updatedTalents = childTalents.filter((item: any, index : number) => index !== idx);

    setChildTalent(updatedTalents)
  };

  const handleAddChild = async (event: any) => {
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
        const updatedTalents = [...childTalents];
        updatedTalents.push(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setChildTalent(updatedTalents);
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleChildModelUpload = async (event: any) => {
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
        setChildModel(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleChildUpdate = async () => {
    if(!childHeader) {
      toast.error("Header is required!");
      return;
    }
    if(!childDescription) {
      toast.error('Description is required!');
      return;
    }
    setDataLoading(true);
    await UpdateChild({
      Description: childDescription,
      Image: childTalents,
      Header: childHeader,
      Model: childModel
    })
    setDataLoading(false);
  }

  const handleProDelete = (idx: number) => {
    const updatedTalents = proTalents.filter((item: any, index : number) => index !== idx);

    setProTalent(updatedTalents)
  };

  const handleAddPro = async (event: any) => {
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
        const updatedTalents = [...proTalents];
        updatedTalents.push(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setProTalent(updatedTalents);
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleProModelUpload = async (event: any) => {
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
        setProModel(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleProUpdate = async () => {
    if(!proHeader) {
      toast.error("Header is required!");
      return;
    }
    if(!proDescription) {
      toast.error('Description is required!');
      return;
    }
    setDataLoading(true);
    await UpdatePro({
      Description: proDescription,
      Image: proTalents,
      Header: proHeader,
      Model: proModel
    })
    setDataLoading(false);
  }

  const handleLifeDelete = (idx: number) => {
    const updatedTalents = lifeTalents.filter((item: any, index : number) => index !== idx);

    setLifeTalent(updatedTalents)
  };

  const handleAddLife = async (event: any) => {
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
        const updatedTalents = [...lifeTalents];
        updatedTalents.push(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setLifeTalent(updatedTalents);
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleLifeModelUpload = async (event: any) => {
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
        setLifeModel(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleLifeUpdate = async () => {
    if(!lifeHeader) {
      toast.error("Header is required!");
      return;
    }
    if(!lifeDescription) {
      toast.error('Description is required!');
      return;
    }
    setDataLoading(true);
    await UpdateLife({
      Description: lifeDescription,
      Image: lifeTalents,
      Header: lifeHeader,
      Model: lifeModel
    })
    setDataLoading(false);
  }

  const handlePhotoDelete = (idx: number) => {
    const updatedTalents = photoTalents.filter((item: any, index : number) => index !== idx);

    setPhotoTalent(updatedTalents)
  };

  const handleAddPhoto = async (event: any) => {
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
        const updatedTalents = [...photoTalents];
        updatedTalents.push(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setPhotoTalent(updatedTalents);
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handlePhotoModelUpload = async (event: any) => {
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
        setPhotoModel(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handlePhotoUpdate = async () => {
    if(!photoHeader) {
      toast.error("Header is required!");
      return;
    }
    if(!photoDescription) {
      toast.error('Description is required!');
      return;
    }
    setDataLoading(true);
    await UpdatePhoto({
      Description: photoDescription,
      Image: photoTalents,
      Header: photoHeader,
      Model: photoModel
    })
    setDataLoading(false);
  }

  const handleMakeDelete = (idx: number) => {
    const updatedTalents = makeTalents.filter((item: any, index : number) => index !== idx);

    setMakeTalents(updatedTalents)
  };

  const handleAddMake = async (event: any) => {
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
        const updatedTalents = [...makeTalents];
        updatedTalents.push(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setMakeTalents(updatedTalents);
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleMakeModelUpload = async (event: any) => {
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
        setMakeModel(downloadURL);
        toast.success("Your image has been successfully uploaded!");
        setDataLoading(false);
      }
    );
    event.target.value = null;
  };

  const handleMakeUpdate = async () => {
    if(!makeHeader) {
      toast.error("Header is required!");
      return;
    }
    if(!makeDescription) {
      toast.error('Description is required!');
      return;
    }
    setDataLoading(true);
    await UpdateMake({
      Description: makeDescription,
      Image: makeTalents,
      Header: makeHeader,
      Model: makeModel
    })
    setDataLoading(false);
  }

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Edit Talent
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <Tabs aria-label="Options">
              <Tab key="photos" title="Female">
              <div className="flex flex-col gap-5">
                  <Input
                    label="Header"
                    value={femaleHeader}
                    isRequired
                    onChange={(e) => setFeMaleHeader(e.target.value)}
                  />
                  <div className="grid grid-cols-4 relative">
                    <div className="relative">
                      <img src={femaleModel} className="w-full" />
                      <label
                        htmlFor="femaleinput"
                        className="p-2 bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Choose Image
                      </label>
                      <input
                        type="file"
                        id="femaleinput"
                        className="hidden"
                        onChange={handleFemaleModelUpload}
                      />
                    </div>
                  </div>
                  <div className={`border-[2px] rounded-lg py-1 `}>
                    <QuillNoSSRWrapper
                      className={`w-full bg-white h-[200px] mb-[40px] `}
                      theme="snow"
                      value={femaleDescription}
                      onChange={setFeMaleDescription}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-5">
                    {femaleTalents?.map((item: string, index: number) => (
                      <Card key={"female talents" + index}>
                        <CardBody>
                          <div className="relative flex flex-col gap-5 justify-center">
                            <img src={item} className="rounded-lg my-auto" />
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="absolute right-[0px] top-0 z-[10] bg-white"
                              onClick={() => handleFemaleDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    <div className="relative min-h-10">
                      <label
                        htmlFor="femalebrandinput"
                        className="p-2 bg-primary w-full text-center text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Add Talent
                      </label>
                      <input
                        type="file"
                        id="femalebrandinput"
                        className="hidden"
                        onChange={handleAddFemale}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                        onClick={handleFemaleUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Tab>
              <Tab key="music" title="Male">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Header"
                    value={maleHeader}
                    isRequired
                    onChange={(e) => setMaleHeader(e.target.value)}
                  />
                  <div className="grid grid-cols-4 relative">
                    <div className="relative">
                      <img src={maleModel} className="w-full" />
                      <label
                        htmlFor="maleinput"
                        className="p-2 bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Choose Image
                      </label>
                      <input
                        type="file"
                        id="maleinput"
                        className="hidden"
                        onChange={handleMaleModelUpload}
                      />
                    </div>
                  </div>
                  <div className={`border-[2px] rounded-lg py-1 `}>
                    <QuillNoSSRWrapper
                      className={`w-full bg-white h-[200px] mb-[40px] `}
                      theme="snow"
                      value={maleDescription}
                      onChange={setMaleDescription}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-5">
                    {maleTalents?.map((item: string, index: number) => (
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
                              onClick={() => handleMaleDelete(index)}
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
                        Add Talent
                      </label>
                      <input
                        type="file"
                        id="brandinput"
                        className="hidden"
                        onChange={handleAddMale}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                        onClick={handleMaleUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Tab>
              <Tab key="Kid" title="Child">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Header"
                    value={childHeader}
                    isRequired
                    onChange={(e) => setChildHeader(e.target.value)}
                  />
                  <div className="grid grid-cols-4 relative">
                    <div className="relative">
                      <img src={childModel} className="w-full" />
                      <label
                        htmlFor="childinput"
                        className="p-2 bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Choose Image
                      </label>
                      <input
                        type="file"
                        id="childinput"
                        className="hidden"
                        onChange={handleChildModelUpload}
                      />
                    </div>
                  </div>
                  <div className={`border-[2px] rounded-lg py-1 `}>
                    <QuillNoSSRWrapper
                      className={`w-full bg-white h-[200px] mb-[40px] `}
                      theme="snow"
                      value={childDescription}
                      onChange={setChildDescription}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-5">
                    {childTalents?.map((item: string, index: number) => (
                      <Card key={"childtalents" + index}>
                        <CardBody>
                          <div className="relative flex flex-col gap-5 justify-center">
                            <img src={item} className="rounded-lg my-auto" />
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="absolute right-[0px] top-0 z-[10] bg-white"
                              onClick={() => handleChildDelete(index)}
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
                        Add Talent
                      </label>
                      <input
                        type="file"
                        id="brandinput"
                        className="hidden"
                        onChange={handleAddChild}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                        onClick={handleChildUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Tab>
              <Tab key="Promotional" title="Promotional">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Header"
                    value={proHeader}
                    isRequired
                    onChange={(e) => setProHeader(e.target.value)}
                  />
                  <div className="grid grid-cols-4 relative">
                    <div className="relative">
                      <img src={proModel} className="w-full" />
                      <label
                        htmlFor="proinput"
                        className="p-2 bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Choose Image
                      </label>
                      <input
                        type="file"
                        id="proinput"
                        className="hidden"
                        onChange={handleProModelUpload}
                      />
                    </div>
                  </div>
                  <div className={`border-[2px] rounded-lg py-1 `}>
                    <QuillNoSSRWrapper
                      className={`w-full bg-white h-[200px] mb-[40px] `}
                      theme="snow"
                      value={proDescription}
                      onChange={setProDescription}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-5">
                    {proTalents?.map((item: string, index: number) => (
                      <Card key={"protalents" + index}>
                        <CardBody>
                          <div className="relative flex flex-col gap-5 justify-center">
                            <img src={item} className="rounded-lg my-auto" />
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="absolute right-[0px] top-0 z-[10] bg-white"
                              onClick={() => handleProDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    <div className="relative min-h-10">
                      <label
                        htmlFor="probrandinput"
                        className="p-2 bg-primary w-full text-center text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Add Talent
                      </label>
                      <input
                        type="file"
                        id="probrandinput"
                        className="hidden"
                        onChange={handleAddPro}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                        onClick={handleProUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Tab>
              <Tab key="Life" title="Lifestyle">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Header"
                    value={lifeHeader}
                    isRequired
                    onChange={(e) => setLifeHeader(e.target.value)}
                  />
                  <div className="grid grid-cols-4 relative">
                    <div className="relative">
                      <img src={lifeModel} className="w-full" key="lifestyle model"/>
                      <label
                        htmlFor="lifeinput"
                        className="p-2 bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Choose Image
                      </label>
                      <input
                        type="file"
                        id="lifeinput"
                        className="hidden"
                        onChange={handleLifeModelUpload}
                      />
                    </div>
                  </div>
                  <div className={`border-[2px] rounded-lg py-1 `}>
                    <QuillNoSSRWrapper
                      className={`w-full bg-white h-[200px] mb-[40px] `}
                      theme="snow"
                      value={lifeDescription}
                      onChange={setLifeDescription}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-5">
                    {lifeTalents?.map((item: string, index: number) => (
                      <Card key={"lifetalents" + index}>
                        <CardBody>
                          <div className="relative flex flex-col gap-5 justify-center">
                            <img src={item} className="rounded-lg my-auto" />
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="absolute right-[0px] top-0 z-[10] bg-white"
                              onClick={() => handleLifeDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    <div className="relative min-h-10">
                      <label
                        htmlFor="lifebrandinput"
                        className="p-2 bg-primary w-full text-center text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Add Talent
                      </label>
                      <input
                        type="file"
                        id="lifebrandinput"
                        className="hidden"
                        onChange={handleAddLife}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                        onClick={handleLifeUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Tab>
              <Tab key="Photographer" title="Photographer">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Header"
                    value={photoHeader}
                    isRequired
                    onChange={(e) => setPhotoHeader(e.target.value)}
                  />
                  <div className="grid grid-cols-4 relative">
                    <div className="relative">
                      <img src={photoModel} className="w-full" key="photo model"/>
                      <label
                        htmlFor="photoinput"
                        className="p-2 bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Choose Image
                      </label>
                      <input
                        type="file"
                        id="photoinput"
                        className="hidden"
                        onChange={handlePhotoModelUpload}
                      />
                    </div>
                  </div>
                  <div className={`border-[2px] rounded-lg py-1 `}>
                    <QuillNoSSRWrapper
                      className={`w-full bg-white h-[200px] mb-[40px] `}
                      theme="snow"
                      value={photoDescription}
                      onChange={setPhotoDescription}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-5">
                    {photoTalents?.map((item: string, index: number) => (
                      <Card key={"phototalents" + index}>
                        <CardBody>
                          <div className="relative flex flex-col gap-5 justify-center">
                            <img src={item} className="rounded-lg my-auto" />
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="absolute right-[0px] top-0 z-[10] bg-white"
                              onClick={() => handlePhotoDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    <div className="relative min-h-10">
                      <label
                        htmlFor="photobrandinput"
                        className="p-2 bg-primary w-full text-center text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Add Talent
                      </label>
                      <input
                        type="file"
                        id="photobrandinput"
                        className="hidden"
                        onChange={handleAddPhoto}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                        onClick={handlePhotoUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </Tab>
              <Tab key="Makeup Artist" title="Makeup Artist">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Header"
                    value={makeHeader}
                    isRequired
                    onChange={(e) => setMakeHeader(e.target.value)}
                  />
                  <div className="grid grid-cols-4 relative">
                    <div className="relative">
                      <img src={makeModel} className="w-full" key="make model"/>
                      <label
                        htmlFor="makeinput"
                        className="p-2 bg-primary text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Choose Image
                      </label>
                      <input
                        type="file"
                        id="makeinput"
                        className="hidden"
                        onChange={handleMakeModelUpload}
                      />
                    </div>
                  </div>
                  <div className={`border-[2px] rounded-lg py-1 `}>
                    <QuillNoSSRWrapper
                      className={`w-full bg-white h-[200px] mb-[40px] `}
                      theme="snow"
                      value={makeDescription}
                      onChange={setMakeDescription}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-5">
                    {makeTalents?.map((item: string, index: number) => (
                      <Card key={"maketalents" + index}>
                        <CardBody>
                          <div className="relative flex flex-col gap-5 justify-center">
                            <img src={item} className="rounded-lg my-auto" />
                            <Button
                              isIconOnly
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="absolute right-[0px] top-0 z-[10] bg-white"
                              onClick={() => handleMakeDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                    <div className="relative min-h-10">
                      <label
                        htmlFor="makebrandinput"
                        className="p-2 bg-primary w-full text-center text-white hover:bg-opacity-60 transition cursor-pointer rounded-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      >
                        Add Talent
                      </label>
                      <input
                        type="file"
                        id="makebrandinput"
                        className="hidden"
                        onChange={handleAddMake}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full"
                        onClick={handleMakeUpdate}
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
