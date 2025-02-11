import {
  CancellationText,
  MakeupText,
  ReferralsText,
  SocialText,
  TalentExpectationsText,
} from "@/lib/texts";
import { create } from "zustand";

type EventDate = {
  eventDate: string;
  startTime: string;
  endTime: string;
};

type TalentInfo = {
  id: string;
  name: string;
  url?: string;
};

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();

export interface JobState {
  clientsList: Array<any>;
  accountsList: Array<any>;
  eventType: any;
  talentQuota: string;
  eventTitle: string;
  eventRef: string;
  eventDescription: string;
  eventDates: Array<EventDate>;
  requiredAttendDay: any;
  address1: string;
  address2: string;
  city: string;
  state: any;
  zip: string;
  talentRate: string;
  clientRate: string;
  agencyFee: any;
  rateBasis: any;
  clientAssigned: any;
  contactName: string;
  contactPhone: string;
  wardrobe: string;
  parking: string;
  makeup: string;
  travel: string;
  recap: string;
  social: string;
  additionalLocation: string;
  referrals: string;
  talentExpectations: string;
  cancellation: string;
  contacts: string;
  miscellaneous: string;
  talentInvited: Array<TalentInfo>;
  location: string;
  talentNote: string;
  setTalentNote:(value: string) => void;
  setClientsList: (value: Array<any>) => void;
  setAccountsList: (value: Array<any>) => void;
  setEventType: (value: any) => void;
  setTalentQuota: (value: string) => void;
  setEventTitle: (value: string) => void;
  setEventRef: (value: string) => void;
  setEventDescription: (value: string) => void;
  setEventDates: (value: Array<EventDate>) => void;
  setRequiredAttendDay: (value: any) => void;
  setAddress1: (value: string) => void;
  setAddress2: (value: string) => void;
  setCity: (value: string) => void;
  setState: (value: any) => void;
  setZip: (value: string) => void;
  setTalentRate: (value: string) => void;
  setClientRate: (value: string) => void;
  setAgencyFee: (value: any) => void;
  setRateBasis: (value: any) => void;
  setClientAssigned: (value: any) => void;
  setContactName: (value: string) => void;
  setContactPhone: (value: string) => void;
  setWardrobe: (value: string) => void;
  setParking: (value: string) => void;
  setMakeup: (value: string) => void;
  setTravel: (value: string) => void;
  setRecap: (value: string) => void;
  setSocial: (value: string) => void;
  setAdditionalLocation: (value: string) => void;
  setReferrals: (value: string) => void;
  setTalentExpectations: (value: string) => void;
  setCancellation: (value: string) => void;
  setContacts: (value: string) => void;
  setMiscellaneous: (value: string) => void;
  setTalentInvited: (value: Array<TalentInfo>) => void;
  setLocation: (value: string) => void;
}

const useJobState = create<JobState>((set) => ({
  clientsList: [],
  accountsList: [],
  location: '',
  eventType: new Set<string>(["Tradeshow"]),
  talentQuota: "1",
  eventTitle: "",
  eventRef: "",
  eventDescription: "",
  eventDates: [
    {
      eventDate: `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`,
      startTime: "08:00",
      endTime: "09:00",
    },
  ],
  requiredAttendDay: new Set<string>(["Yes"]),
  address1: "",
  address2: "",
  city: "",
  state: new Set<string>(["Florida"]),
  zip: "",
  talentRate: "",
  clientRate: "",
  agencyFee: new Set<string>(["0%"]),
  rateBasis: new Set<string>(["Total"]),
  clientAssigned: "",
  contactName: "",
  contactPhone: "",
  wardrobe: "",
  parking: "",
  makeup: MakeupText,
  travel: "",
  recap: "",
  social: SocialText,
  additionalLocation: "",
  referrals: ReferralsText,
  talentExpectations: TalentExpectationsText,
  cancellation: CancellationText,
  contacts: "",
  miscellaneous: "",
  talentInvited: [],
  talentNote: "",
  setTalentNote: (value: string) => set((state) => ({ talentNote: value })),
  setClientsList: (value: Array<any>) =>
    set((state) => ({ clientsList: value })),
  setAccountsList: (value: Array<any>) =>
    set((state) => ({ accountsList: value })),
  setEventType: (value: any) => set((state) => ({ eventType: value })),
  setTalentQuota: (value: string) => set((state) => ({ talentQuota: value })),
  setLocation: (value: string) => set((state) => ({ location: value })),
  setEventTitle: (value: string) => set((state) => ({ eventTitle: value })),
  setEventRef: (value: string) => set((state) => ({ eventRef: value })),
  setEventDescription: (value: string) =>
    set((state) => ({ eventDescription: value })),
  setEventDates: (value: Array<EventDate>) =>
    set((state) => ({ eventDates: value })),
  setRequiredAttendDay: (value: any) =>
    set((state) => ({ requiredAttendDay: value })),
  setAddress1: (value: string) => set((state) => ({ address1: value })),
  setAddress2: (value: string) => set((state) => ({ address2: value })),
  setCity: (value: string) => set((state) => ({ city: value })),
  setState: (value: any) => set((state) => ({ state: value })),
  setZip: (value: string) => set((state) => ({ zip: value })),
  setTalentRate: (value: string) => set((state) => ({ talentRate: value })),
  setClientRate: (value: string) => set((state) => ({ clientRate: value })),
  setAgencyFee: (value: any) => set((state) => ({ agencyFee: value })),
  setRateBasis: (value: any) => set((state) => ({ rateBasis: value })),
  setClientAssigned: (value: any) =>
    set((state) => ({ clientAssigned: value })),
  setContactName: (value: string) => set((state) => ({ contactName: value })),
  setContactPhone: (value: string) => set((state) => ({ contactPhone: value })),
  setWardrobe: (value: string) => set((state) => ({ wardrobe: value })),
  setParking: (value: string) => set((state) => ({ parking: value })),
  setMakeup: (value: string) => set((state) => ({ makeup: value })),
  setTravel: (value: string) => set((state) => ({ travel: value })),
  setRecap: (value: string) => set((state) => ({ recap: value })),
  setSocial: (value: string) => set((state) => ({ social: value })),
  setAdditionalLocation: (value: string) =>
    set((state) => ({ additionalLocation: value })),
  setReferrals: (value: string) => set((state) => ({ referrals: value })),
  setTalentExpectations: (value: string) =>
    set((state) => ({ talentExpectations: value })),
  setCancellation: (value: string) => set((state) => ({ cancellation: value })),
  setContacts: (value: string) => set((state) => ({ contacts: value })),
  setMiscellaneous: (value: string) =>
    set((state) => ({ miscellaneous: value })),
  setTalentInvited: (value: Array<TalentInfo>) =>
    set((state) => ({ talentInvited: value })),
}));

export default useJobState;
