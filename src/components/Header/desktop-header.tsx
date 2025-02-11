"use client";
import { HeaderItem } from "./item";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { clientAuth, db } from "@/lib/firebaseclient";
import { MailIcon } from "./MailIcon.jsx";
import { LockIcon } from "./LockIcon.jsx";
import { useEffect, useState } from "react";
import { DropdownItems } from "./DropdownItem";
import { login } from "@/actions/login";
import { signInWithEmailAndPassword } from "firebase/auth";
import useParticipantStore from "@/store/use-participant";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { users } from "@/lib/types/firestore";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome } from "@fortawesome/free-solid-svg-icons";
import { FooterIcon } from "../Footer/icon";
import Link from "next/link";

export const DesktopHeader = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isEmaliValid, setEmailValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    logged,
    setLogged,
    accountType,
    setAccountType,
    setAirtableId,
    loading,
    setDataLoading,
    setAuthLoading,
    auth_loading,
    setDashboardMenu,
    dashboardMenu,
  } = useParticipantStore((state) => state);
  const [isLoading, setLoading] = useState(false);
  const { asPath } = useRouter();
  const [signinButton, setSigninButton] = useState(<></>);
  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const handleMouseOut = () => {
    setDropdownVisible(false);
  };

  const handleMouseOver = () => {
    setDropdownVisible(true);
  };

  const handleLogin = async () => {
    // console.log(email);
    setLoading(true);
    setEmailValid(false);
    setPasswordValid(false);
    if (!validateEmail(email)) {
      setLoading(false);
      setEmailValid(true);
      return;
    }
    if (password.length === 0) {
      setPasswordValid(true);
      return;
    }
    const res = await login(email, password);
    if (res === true)
      await signInWithEmailAndPassword(clientAuth, email, password);
    else {
      toast.error("Your email and password is incorrect!");
      setLoading(false);
      return;
    }
    setLoading(false);
    onOpenChange();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(clientAuth, (user) => {
      setAuthLoading(true);
      if (user) {
        setLogged(true);
        setAuthLoading(false);
      } else {
        setLogged(false);
        setAuthLoading(false);
        console.log(asPath);
        console.log(
          // asPath.search("/dashboard/talents/") >= 0 ||
          // asPath.search("dashboard/package") >= 0 ||
          // asPath.search("dashboard") < 0
        );
        if (
          !(
            asPath.search("/dashboard/talents/") >= 0 ||
            asPath.search("dashboard/package") >= 0 ||
            asPath.search("dashboard") < 0
          ) || asPath.search("job-board") >=0
         )
          router.push("/");
        // if (
        //   asPath.search("/dashboard") >= 0 ||
        //   asPath.search("/job-board") >= 0
        // ) {
        //   if (
        //     !(
        //       asPath.search("/dashboard/talents/") >= 0 ||
        //       asPath.search("dashboard/package")
        //     )
        //   ) {

        //     router.push("/");
        //   }
        // }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await getDoc(
        doc(db, "users", clientAuth.currentUser?.uid.toString() || "")
      );
      if (res.exists()) {
        const data = res.data() as users;
        // console.log(data);
        setAccountType(data.type);
        setAirtableId(data.airtable_id);
      }
      setDataLoading(false);
    };
    if (logged === true) fetchUserData();
  }, [logged]);

  useEffect(()=>{
    setSigninButton(clientAuth.currentUser ? (
      <div className="flex flex-row gap-8 z-[30]">
        <Dropdown>
          <DropdownTrigger>
            <button>
              <Avatar
                showFallback
                src="https://images.unsplash.com/broken"
              />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions">
            <DropdownItem
              key="logout"
              color="danger"
              className="text-danger"
              onClick={() => {
                clientAuth.signOut();
                setAirtableId("");
                setAccountType("");
                router.push("/");
              }}
            >
              Log out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    ) : (
      <a href="/" className="my-auto">
        <FontAwesomeIcon icon={faHome} className="text-black" size="1x" />
      </a>
    ))
  },[clientAuth.currentUser])

  const router = useRouter();

  const items = [{ key: "delete", label: "Log out" }];

  if (asPath.indexOf("dashboard") < 0 && asPath.indexOf("job-board") < 0)
    return (
      <div className="mx-auto flex flex-row justify-between py-[15px] min-[1400px]:max-w-[1320px] text-center z-[30]">
        <button onClick={() => router.push("/")}>
          <img
            src="/assets/images/logo.png"
            width={294}
            height={56}
            alt="Desktop-Logo"
          />
        </button>
        <div className="flex flex-row gap-8 z-[30]">
          {accountType && logged && accountType != "client" ? (
            <HeaderItem text="Dashboard" href="/dashboard" />
          ) : (
            ""
          )}
          <HeaderItem text="Home" href="/" />
          <HeaderItem text="About Us" href="/about-us" />
          <div
            className="my-auto relative py-[10px] px-[5px] text-[16px] leading-[19.2px] font-medium cursor-pointer z-[30]"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            Talent
            {dropdownVisible ? (
              <div
                className="absolute pt-[25px] z-[30]"
                style={{ width: "max-content" }}
              >
                <div className=" bg-white border-black border-t-[5px] flex flex-col gap-5 pt-5 pb-4">
                  <DropdownItems text="Female Models" href="/female-models" />
                  <DropdownItems text="Male Models" href="/male-models" />
                  <DropdownItems text="Child Models" href="/child-models" />
                  <DropdownItems
                    text="Promotional Models"
                    href="/promotional-models"
                  />
                  <DropdownItems
                    text="Lifestyle Models"
                    href="/lifestyle-models"
                  />
                  <DropdownItems text="Photographers" href="/photographers" />
                  <DropdownItems text="Makeup Artists" href="/makeup-artists" />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <HeaderItem text="Contact" href="/contact" />
          <div className="flex flex-row justify-center py-[10px] gap-2">
            <FooterIcon
              src="/assets/icons/fb.svg"
              href="https://www.facebook.com/Micheleandgroup"
              color="#3b5998"
            />
            <FooterIcon
              src="/assets/icons/insta.svg"
              href="https://instagram.com/micheleandgroup/"
            />
            <FooterIcon
              src="/assets/icons/twitter.svg"
              href="https://twitter.com/micheleandgroup"
              color="#03a9f4"
            />
            <FooterIcon
              src="/assets/icons/yt.svg"
              href="http://youtube.com/"
              color="#ff0000"
            />
          </div>
          <div className="pt-[5px] flex flex-row gap-2">
            {!logged ? (
              <Button onPress={onOpen} color="primary" radius="full">
                Login
              </Button>
            ) : (
              <Button
                onClick={() => {
                  clientAuth.signOut();
                  router.push("/");
                }}
                color="primary"
                radius="full"
              >
                Logout
              </Button>
            )}
            {!logged ? (
              <div
              // href="/register" 
              // href="https://web.miniextensions.com/Hs2JY9OqGMDBBqxQdxbz"
              >
                <Button color="danger" radius="full" onClick={() => router.push('/register')}>
                  Register
                </Button>
              </div>
            ) : (
              ""
            )}
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="top-center"
              backdrop="blur"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Log in
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        autoFocus
                        endContent={
                          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        variant="bordered"
                        isRequired
                        isInvalid={isEmaliValid}
                        color={isEmaliValid ? "danger" : "default"}
                        value={email}
                        onValueChange={setEmail}
                        errorMessage={
                          isEmaliValid && "Please enter a valid email"
                        }
                      />
                      <Input
                        endContent={
                          <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        variant="bordered"
                        isRequired
                        isInvalid={isPasswordValid}
                        color={isPasswordValid ? "danger" : "default"}
                        value={password}
                        onValueChange={setPassword}
                        errorMessage={
                          isPasswordValid && "Please enter your password"
                        }
                      />
                      {/* <div className="flex py-2 px-1 justify-between">
                      <Checkbox
                        classNames={{
                          label: "text-small",
                        }}
                      >
                        Remember me
                      </Checkbox>
                      <Link color="primary" href="#" size="sm">
                        Forgot password?
                      </Link>
                    </div> */}
                    </ModalBody>
                    <ModalFooter className="flex flex-row justify-between">
                      <Link
                        href="https://web.miniextensions.com/WhsUEaloxtzje4OvEzwa"
                        className="flex flex-col justify-end"
                        onClick={() => {
                          onOpenChange();
                        }}
                      >
                        Forgot Password
                      </Link>
                      <div className="flex flex-row gap-2">
                        <Button color="danger" variant="flat" onPress={onClose}>
                          Close
                        </Button>
                        <Button
                          color="primary"
                          onClick={handleLogin}
                          isLoading={isLoading}
                        >
                          Sign in
                        </Button>
                      </div>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
          {/* <button className="py-[15px] px-[34px] transition ease-in-out duration-300 bg-primary rounded-l-full rounded-r-full primary-shadow hover:bg-[#DE943E] font-medium">
          Log in
        </button> */}
        </div>
        {auth_loading ? (
          <div className="fixed z-[100] top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-md">
            <Spinner
              label="Loading..."
              color="primary"
              labelColor="primary"
              size="lg"
              className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
            />
          </div>
        ) : (
          ""
        )}
        {loading ? (
          <div className="fixed z-[100] top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-md">
            <Spinner
              label="Loading..."
              color="primary"
              labelColor="primary"
              size="lg"
              className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  else
    return (
      <div className="mx-auto flex flex-row justify-between py-[15px] px-[15px] text-center z-[30]">
        <div className="flex flex-row gap-[20px]">
          <button
            className="xl:hidden my-auto rounded-md bg-white hover:bg-gray-200 transition p-2"
            onClick={() => {
              setDashboardMenu(!dashboardMenu);
            }}
          >
            <FontAwesomeIcon icon={faBars} size="xl" />
          </button>
          <button onClick={() => router.push("/")}>
            <img
              src="/assets/images/logo.png"
              width={294}
              height={56}
              alt="Desktop-Logo"
            />
          </button>
        </div>
        {signinButton}
        {auth_loading ? (
          <div className="fixed z-[100] top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-md">
            <Spinner
              label="Loading..."
              color="primary"
              labelColor="primary"
              size="lg"
              className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
            />
          </div>
        ) : (
          ""
        )}
        {loading ? (
          <div className="fixed z-[100] top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-md">
            <Spinner
              label="Loading..."
              color="primary"
              labelColor="primary"
              size="lg"
              className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
};
