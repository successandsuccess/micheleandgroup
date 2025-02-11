"use client"
import {
  faAddressBook,
  faBoxesPacking,
  faBriefcase,
  faBullhorn,
  faCalendarDays,
  faChalkboard,
  faChalkboardUser,
  faComments,
  faEnvelope,
  faFileZipper,
  faFolderPlus,
  faHouse,
  faImage,
  faKey,
  faLocationDot,
  faMagnifyingGlass,
  faPenToSquare,
  faRankingStar,
  faShop,
  faUser,
  faUserCheck,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { SidebarItem } from "./sidebarItem";
import useParticipantStore from "@/store/use-participant";
import { SubMenu } from "./subMenu";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { SidebarItemWithBadge } from "./sidebarItemBadge";
import { useRouter } from "next/router";
import { GetInvitations } from "@/actions/getInvitation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { clientAuth } from "@/lib/firebaseclient";

const Sidebar = () => {
  const {
    accountType,
    dashboardMenu,
    invitationBadge,
    messageBadge,
    airtable_id,
    setDataLoading,
    setInvitationBadge,
  } = useParticipantStore((state) => state);

  const [sidebarArr, setSidebarArr] = useState(Array(6).fill(false));

  const handleClick = (index: number) => {
    const updated = Array(6).fill(false);
    updated[index] = true;
    setSidebarArr(updated);
  };
  const [emptyComponent, setEmptyComponent] = useState(<></>);
  const { asPath } = useRouter();

  useEffect(() => {
    (async () => {
      if (airtable_id && accountType === "talent") {
        const result = await GetInvitations(airtable_id);
        if (result.status === false) {
          toast.error("Please check your internet connection!");
          return;
        }
        const data = result.data.data.records;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          console.log(item);
          if (
            !item.fields?.["Available Talent"]?.includes(airtable_id) &&
            !item.fields?.["TALENT NOT AVAILABLE"]?.includes(airtable_id) &&
            !item.fields?.["DECLINED TALENT"]?.includes(airtable_id)
          ) {
            // toast.info('You have received new job invitation!')
            setInvitationBadge(true);
            return;
          }
        }
      }
    })();
  }, [airtable_id, accountType]);

  useEffect(()=>{
    setEmptyComponent(!clientAuth.currentUser? <div></div>
    : (
        <div
          className="sidebar flex flex-col py-[30px] px-[20px] bg-white shadow-md text-[#777] primary-transition left-0"
          style={!dashboardMenu ? { left: "-400px" } : { left: "0px" }}
        >
          <Spinner />
        </div>
      ))
  },[clientAuth.currentUser])

  if (accountType === "talent")
    return (
      <div
        className="sidebar flex flex-col py-[30px] px-[20px] bg-white shadow-md text-[#777] primary-transition left-0 h-full"
        style={!dashboardMenu ? { left: "-400px" } : { left: "0px" }}
      >
        <SidebarItem
          pattern={/^\/dashboard$/}
          text="Dashboard"
          href="/dashboard/"
          icon={faChalkboard}
        />
        <SidebarItem
          pattern={/^\/dashboard\/profile(\/edit)?$/}
          text="Profile"
          href="/dashboard/profile"
          icon={faUser}
        />
        <SidebarItem
          pattern={/^\/dashboard\/edit-account$/}
          text="Change Password"
          href="/dashboard/edit-account"
          icon={faKey}
        />
        <SidebarItemWithBadge
          text="Job Invitations"
          href="/dashboard/invitations"
          icon={faEnvelope}
          badge={invitationBadge}
        />
        <SidebarItem
          pattern={/^\/job-board\/booked(\/rec\w+)?$/}
          text="Booked Jobs"
          href="/job-board/booked"
          icon={faUserCheck}
        />
        {/* <SidebarItem
          pattern={/^\/dashboard\/talent-info-update$/}
          text="Profile Address"
          href="/dashboard/talent-info-update/"
          icon={faLocationDot}
        /> */}
        
        <SidebarItem
          pattern={/^\/dashboard\/calendar$/}
          text="Calendar"
          href="/dashboard/calendar"
          icon={faCalendarDays}
        />
        <SidebarItem
          pattern={/^\/job-board(\/rec\w+)?$/}
          text="Job Board"
          href="/job-board"
          icon={faBriefcase}
        />
        
        
        {/* <SidebarItemWithBadge
          text="Messages"
          href="/dashboard/messages"
          icon={faComments}
          badge={messageBadge}
        /> */}
      </div>
    );
  else if (accountType === "booker")
    return (
      <div
        className="sidebar flex flex-col py-[30px] px-[20px] bg-white shadow-md text-[#777] primary-transition left-0"
        style={!dashboardMenu ? { left: "-400px" } : { left: "0px" }}
      >
        {/* <SubMenu index={0} sidebarArr={sidebarArr} onClick={handleClick} 
          height="!h-[160px]"
          text="Booker Management"
          subhref={[
            "/dashboard/access",
            // "/job-board",
            // "/dashboard/clients",
            "/dashboard/package",
          ]}
          icon={faShop}
        >
          <SidebarItem text="Access" href="/dashboard/access" icon={faKey} /> 
           <SidebarItem
            text="Job Board"
            href="/job-board"
            icon={faBriefcase}
          />  <SidebarItem text="Clients" href="/dashboard/clients" icon={faUser} />  <SidebarItem
            text="Package"
            href="/dashboard/package"
            icon={faFileZipper}
          />
        </SubMenu> */}
        <SidebarItem
          pattern={/^\/dashboard$/}
          text="Dashboard"
          href="/dashboard/"
          icon={faChalkboard}
        />
        <SubMenu
          index={1}
          sidebarArr={sidebarArr}
          onClick={handleClick}
          height="!h-[180px]"
          text="Clients Management"
          subhref={["/dashboard/clients/view", "/dashboard/clients/add"]}
          icon={faUser}
        >
          <SidebarItem
            pattern={/^\/dashboard\/clients\/view$/}
            text="View Clients"
            href="/dashboard/clients/view"
            icon={faUser}
          />
          <SidebarItem
            pattern={/^\/dashboard\/clients\/add$/}
            text="Add Clients"
            href="/dashboard/clients/add"
            icon={faBriefcase}
          />
        </SubMenu>
        {accountType === "booker" ? (
          <SubMenu
            index={2}
            sidebarArr={sidebarArr}
            onClick={handleClick}
            height="!h-[280px]"
            text="General
           Management"
            subhref={[
              "/dashboard/edit-account",
              "/dashboard/calendar",
              "/dashboard/booker-management",
              "/dashboard/activities",
            ]}
            icon={faCalendarDays}
          >
            <SidebarItem
              pattern={/^\/dashboard\/edit-account$/}
              text="Edit Account"
              href="/dashboard/edit-account"
              icon={faPenToSquare}
            />
            <SidebarItem
              pattern={/^\/dashboard\/calendar$/}
              text="Calendar"
              href="/dashboard/calendar"
              icon={faCalendarDays}
            />
            <SidebarItem
              pattern={/^\/dashboard\/booker-management$/}
              text="View Profile"
              href="/dashboard/booker-management"
              icon={faUser}
            />
            <SidebarItem
              pattern={/^\/dashboard\/activities(\?search=\w+)?/}
              text="View Activity"
              href="/dashboard/activities"
              icon={faFileZipper}
            />
          </SubMenu>
          
        ) : (
          ""
        )}

        <SubMenu
          index={3}
          sidebarArr={sidebarArr}
          onClick={handleClick}
          height="!h-[160px]"
          text="Jobs Management"
          subhref={[
            "/dashboard/jobs/search",
            "/dashboard/jobs/add",
            "/dashboard/jobs/add/step-two",
            "/dashboard/jobs/add/review",
            "/dashboard/jobs/import",
          ]}
          icon={faBriefcase}
        >
          <SidebarItem
            pattern={/^\/dashboard\/jobs\/search$/}
            text="Search jobs"
            href="/dashboard/jobs/search"
            icon={faMagnifyingGlass}
          />
          <SidebarItem
            pattern={/^\/dashboard\/jobs\/add/}
            text="Add job"
            href="/dashboard/jobs/add"
            icon={faUserPlus}
          />
          {/* <SidebarItem
            text="Bulk import"
            href="/dashboard/jobs/import"
            icon={faFolderPlus}
          /> */}
        </SubMenu>
        {/* <SubMenu index={4} sidebarArr={sidebarArr} onClick={handleClick}
          height="!h-[180px]"
          text="Package Management"
          subhref={["/dashboard/package/search", "/dashboard/package/add"]}
          icon={faFileZipper}
        >
          <SidebarItem
            text="Search Packages"
            href="/dashboard/package/search"
            icon={faMagnifyingGlass}
          />
          <SidebarItem
            text="Add Package"
            href="/dashboard/package/add"
            icon={faUserPlus}
          />
        </SubMenu> */}
        <SubMenu
          index={5}
          sidebarArr={sidebarArr}
          onClick={handleClick}
          height="!h-[160px]"
          text="Talent Management"
          subhref={["/dashboard/talents/search", "/dashboard/talents/add"]}
          icon={faRankingStar}
        >
          <SidebarItem
            pattern={/^\/dashboard\/talents\/(?!add\b)/}
            text="Search Talent"
            href="/dashboard/talents/search"
            icon={faMagnifyingGlass}
          />
          <SidebarItem
            pattern={/^\/dashboard\/talents\/add/}
            text="Add Talent"
            href="/dashboard/talents/add"
            icon={faUserPlus}
          />
        </SubMenu>
        {/* <SidebarItemWithBadge
          text="Messages"
          href="/dashboard/messages"
          icon={faComments}
          badge={messageBadge}
        /> */}
        <SidebarItem
          pattern={/^\/dashboard\/add-package$/}
          text="Add Package"
          href="/dashboard/add-package"
          icon={faBoxesPacking}
        />
        <SidebarItem
          pattern={/^\/dashboard\/approve$/}
          text="Pictures to Approve"
          href="/dashboard/approve"
          icon={faImage}
        />
      </div>
    );
  else if (accountType === "client")
    return (
      <div
        className="sidebar flex flex-col py-[30px] px-[20px] bg-white shadow-md text-[#777] primary-transition left-0"
        style={!dashboardMenu ? { left: "-400px" } : { left: "0px" }}
      >
        <SidebarItem
          pattern={/^\/dashboard$/}
          text="Dashboard"
          href="/dashboard/"
          icon={faChalkboard}
        />
        {/* <SubMenu
          index={1}
          sidebarArr={sidebarArr}
          onClick={handleClick}
          height="!h-[120px]"
          text="Talent Management"
          subhref={["/dashboard/talents/search", "/dashboard/talents/add"]}
          icon={faRankingStar}
        >
          <SidebarItem
            text="Search Talent"
            href="/dashboard/talents/search"
            icon={faMagnifyingGlass}
          />
        </SubMenu> */}
        <SidebarItem
          pattern={/^\/job-board(\/rec\w+)?$/}
          text="JOBs"
          href="/job-board"
          icon={faBriefcase}
        />
        {/* <SidebarItemWithBadge
          text="Messages"
          href="/dashboard/messages"
          icon={faComments}
          badge={messageBadge}
        /> */}
      </div>
    );
  else if (accountType === "admin")
    return (
      <div
        className="sidebar flex flex-col py-[30px] px-[20px] bg-white shadow-md text-[#777] primary-transition left-0"
        style={!dashboardMenu ? { left: "-400px" } : { left: "0px" }}
      >
        <SidebarItem
          pattern={/^\/dashboard$/}
          text="Dashboard"
          href="/dashboard/"
          icon={faChalkboard}
        />
        <SidebarItem
          pattern={/^\/dashboard\/edit-home$/}
          text="Edit Home"
          href="/dashboard/edit-home"
          icon={faHouse}
        />
        <SidebarItem
          pattern={/^\/dashboard\/edit-about-us$/}
          text="Edit About Us"
          href="/dashboard/edit-about-us"
          icon={faBullhorn}
        />
        <SidebarItem
          pattern={/^\/dashboard\/edit-talents$/}
          text="Edit Talent"
          href="/dashboard/edit-talents"
          icon={faUser}
        />
        <SidebarItem
          pattern={/^\/dashboard\/edit-contacts$/}
          text="Edit Contact"
          href="/dashboard/edit-contacts"
          icon={faAddressBook}
        />
        <SidebarItem
          pattern={/^\/dashboard\/edit-dashboard$/}
          text="Edit Dashboard"
          href="/dashboard/edit-dashboard"
          icon={faChalkboardUser}
        />
        <SidebarItem
          pattern={/^\/dashboard\/edit-email$/}
          text="Edit Email"
          href="/dashboard/edit-email"
          icon={faEnvelope}
        />
      </div>
    );
  else return emptyComponent;
};

export default Sidebar;
