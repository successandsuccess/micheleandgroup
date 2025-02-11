import { create } from "zustand";

type TalentInfo = {
  id: string;
  name: string;
  url?: string;
};

export interface ParticipantState {
  name: string;
  email: string;
  subject: string;
  message: string;
  talentInvited: Array<TalentInfo>;
  url: string;
  availableTalent:  Array<TalentInfo>;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setSubject: (value: string) => void;
  setMessage: (value: string) => void;
  setTalentInvited: (value: Array<TalentInfo>) => void;
  setPreviousUrl: (value: string) => void;
  setAvailableTalent: (value: Array<TalentInfo>) => void;
}

const usePackageStore = create<ParticipantState>((set) => ({
  name: "",
  email: "",
  subject: "",
  message:
    "<p>{$name}</p><p>{$booker_name} has sent you a talent package for your review. You may view it by visiting the following URL:</p><p>Thanks!</p>",
  talentInvited: [],
  url: "/dashboard/",
  availableTalent: [],
  setAvailableTalent: (value: Array<TalentInfo>) =>
    set((state) => ({ availableTalent: value })),
  setName: (value: string) => set((state) => ({ name: value })),
  setEmail: (value: string) => set((state) => ({ email: value })),
  setSubject: (value: string) => set((state) => ({ subject: value })),
  setMessage: (value: string) => set((state) => ({ message: value })),
  setTalentInvited: (value: Array<TalentInfo>) =>
    set((state) => ({ talentInvited: value })),
  setPreviousUrl: (value: string) => set((state) => ({ url: value })),
}));

export default usePackageStore;
