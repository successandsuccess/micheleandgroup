"use client"
import { clientAuth } from "@/lib/firebaseclient";
import useParticipantStore from "@/store/use-participant";
import { faAngleRight, faBars, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
import { MailIcon } from "./MailIcon";
import { LockIcon } from "./LockIcon";
import { login } from "@/actions/login";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import Link from "next/link";

export const MobileHeader = () => {
  const { asPath } = useRouter();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const {
    accountType,
    setDashboardMenu,
    dashboardMenu,
    landingMenu,
    setLandingMenu,
    logged,
    loading,
    auth_loading,
    setAirtableId,
    setAccountType
  } = useParticipantStore((state) => state);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const handleLogin = async () => {
    console.log(email);
    setLoading(true);
    setEmailValid(false);
    setPasswordValid(false);
    if (!validateEmail(email)) {
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
  const [isEmaliValid, setEmailValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clicked, setClicked] = useState(false);
  const [socialClicked, setSocialClicked] = useState(false);
  const [hover, setHover] = useState(false);

  const handleClick = (e: any) => {
    setClicked(!clicked);
  };
  const [logobutton, setLogobutton] = useState(<></>);
  const [signinbutton, setSigninbutton] = useState(<></>);
  useEffect(()=>{
    setLogobutton(clientAuth.currentUser ? (
      <button
        className="xl:hidden my-auto rounded-md bg-white hover:bg-gray-200 transition p-2"
        onClick={() => {
          setDashboardMenu(!dashboardMenu);
          console.log("show dashboard menu", dashboardMenu)
        }}
      >
        <FontAwesomeIcon icon={faBars} size="xl" />
      </button>) : <></>);
    setSigninbutton(clientAuth.currentUser ? (
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
                setAirtableId('');
                setAccountType('');
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
  }, [clientAuth.currentUser, dashboardMenu])

  if (asPath.indexOf("dashboard") < 0 && asPath.indexOf("job-board") < 0)
    return (
      <div className="flex flex-row justify-between p-2">
        <button
          className="xl:hidden my-auto rounded-md hover:bg-gray-200 transition p-2"
          onClick={() => {
            setLandingMenu(!landingMenu);
          }}
        >
          <FontAwesomeIcon icon={faBars} size="xl" />
        </button>
        <button
          onClick={() => {
            router.push("/");
          }}
        >
          <img src="/assets/images/logo.png" className="w-[255px] h-[42.5px]" />
        </button>
        <div
          className={`fixed w-[100vw] h-[100vh] left-0 top-0 bg-transparent ${
            !landingMenu ? "" : "hidden"
          }`}
          onClick={() => setLandingMenu(true)}
        ></div>
        <div
          className="flex flex-col gap-5 shadow-md primary-transition absolute top-[80px] bg-white w-[270px] mobileheight z-10 max-h-[100vh] overflow-auto pb-9"
          style={landingMenu ? { left: "-400px" } : { left: "0px" }}
        >
          {accountType && logged && accountType != "client" ? (
            <button
              className="font-bold text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </button>
          ) : (
            ""
          )}

          <button
            className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
            onClick={() => router.push("/")}
          >
            Home
          </button>
          <button
            className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
            onClick={() => router.push("/about-us")}
          >
            About Us
          </button>
          <div
            className={`rounded-t-[25px] rounded-b-[25px] relative transition-all ${
              clicked ? `h-[360px]` : "h-[54px]"
            } 
         `}
          >
            <button
              className={`w-full hover:bg-black hover:text-white text-left font-medium p-[15px] text-[16px] flex flex-row gap-2 ${
                clicked ? "bg-black text-white" : "bg-white text-black"
              }`}
              onClick={handleClick}
              onMouseOver={() => setHover(true)}
              onMouseOut={() => setHover(false)}
            >
              Talent
            </button>
            <div
              className={`pl-[10px] pb-[15px] flex flex-col max-h-[300px]  ${
                clicked ? "" : "hidden"
              }`}
              style={{}}
            >
              <button
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/female-models")}
              >
                Female Models
              </button>
              <button
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/male-models")}
              >
                Male Models
              </button>
              <button
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/child-models")}
              >
                Child Models
              </button>
              <button
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/promotional-models")}
              >
                Promotional Models
              </button>
              <button
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/lifestyle-models")}
              >
                Lifestyle Models
              </button>
              <button
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/photographers")}
              >
                Photographers
              </button>
              <button
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/makeup-artists")}
              >
                Makeup Artists Models
              </button>
            </div>

            <FontAwesomeIcon
              icon={faAngleRight}
              className={`absolute top-[20px] right-[15px] transition ${
                clicked ? "rotate-90 text-white" : " text-black"
              } ${hover ? "text-white" : "text-black"}`}
            />
          </div>
          <button
            className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
            onClick={() => router.push("/contact")}
          >
            Contact
          </button>
          <div
            className={`rounded-t-[25px] rounded-b-[25px] relative transition-all ${
              socialClicked ? `h-[240px]` : "h-[54px]"
            } 
         `}
          >
            <button
              className={`w-full hover:bg-black hover:text-white text-left font-medium p-[15px] text-[16px] flex flex-row gap-2 ${
                socialClicked ? "bg-black text-white" : "bg-white text-black"
              }`}
              onClick={() => setSocialClicked(!socialClicked)}
              onMouseOver={() => setHover(true)}
              onMouseOut={() => setHover(false)}
            >
              Social
            </button>
            <div
              className={`pl-[10px] pb-[15px] flex flex-col max-h-[236px]  ${
                socialClicked ? "" : "hidden"
              }`}
              style={{}}
            >
              <a
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/female-models")}
                href="https://www.facebook.com/Micheleandgroup"
              >
                Facebook
              </a>
              <a
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/female-models")}
                href="https://instagram.com/micheleandgroup/"
              >
                Instagram
              </a>
              <a
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/female-models")}
                href="https://twitter.com/micheleandgroup"
              >
                Twitter
              </a>
              <a
                className="font-medium text-left py-[11px] pl-[20px] text-black hover:text-white hover:bg-black"
                onClick={() => router.push("/female-models")}
                href="http://youtube.com/"
              >
                Youtube
              </a>
            </div>

            <FontAwesomeIcon
              icon={faAngleRight}
              className={`absolute top-[20px] right-[15px] transition ${
                clicked ? "rotate-90 text-white" : " text-black"
              } ${hover ? "text-white" : "text-black"}`}
            />
          </div>
          {logged ? (
            <button
              className="font-medium text-left py-[11px] pl-[20px] text-black bg-primary primary-shadow hover:text-white hover:bg-black"
              onClick={() => {
                clientAuth.signOut();
                setAirtableId('');
                setAccountType('');
                router.push("/");
              }}
            >
              Log out
            </button>
          ) : (
            <button
              className="font-medium text-left py-[11px] pl-[20px] text-black bg-primary primary-shadow hover:text-white hover:bg-black"
              onClick={() => onOpenChange()}
            >
              Log in
            </button>
          )}
          {logged ? (
            ""
          ) : (
            <a
              href="https://web.miniextensions.com/Hs2JY9OqGMDBBqxQdxbz"
              className="font-medium text-left py-[11px] pl-[20px] text-black bg-[#f31260] no-underline hover:text-white hover:bg-black"
            >
              Register
            </a>
          )}
        </div>
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
                    errorMessage={isEmaliValid && "Please enter a valid email"}
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
                      router.push("/register");
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
      <div className="flex flex-row justify-between py-[15px] px-[15px] text-center z-[30]">
        <div className="flex flex-row gap-[20px] justify-between">
          {logobutton}
          <button onClick={() => router.push("/")}>
            <img
              src="/assets/images/logo.png"
              width={294}
              height={42}
              alt="Desktop-Logo"
            />
          </button>
        </div>
        {signinbutton}

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
