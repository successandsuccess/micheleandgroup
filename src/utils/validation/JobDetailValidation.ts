"use client";

export const isJobDetailValidated = (
  eventTitle: string,
  eventRef: string,
  eventDescription: string,
  location: string,
  talentRate: string,
  clientRate: string,
  contactName: string,
  contactPhone: string,
  clientAssigned: any,
  toast: any,
  isToastDisabled?: boolean
) => {
  if (!eventTitle.length) {
    if (!isToastDisabled) toast.error("Please input Event Title!");
    window.scrollTo(0,0)
    return false;
  }
  // if (!eventRef.length) {
  //   if (!isToastDisabled) toast.error("Please input Event Reference!");window.scrollTo(0,0)
  //   return false;
  // }
  if (!eventDescription.length) {
    if (!isToastDisabled) toast.error("Please input Event Description!");window.scrollTo(0,0)
    return false;
  }
  if (!location.length) {
    if (!isToastDisabled) toast.error("Please input Location!");window.scrollTo(0,0)
    return false;
  }
  if (!talentRate.length) {
    console.log(talentRate);
    if (!isToastDisabled) toast.error("Please input Talent Rate!");window.scrollTo(0,0)
    return false;
  }
  if (!clientRate.length) {
    if (!isToastDisabled) toast.error("Please input Client Rate!");window.scrollTo(0,0)
    return false;
  }
  if (!contactName.length) {
    if (!isToastDisabled) toast.error("Please input Onsite Contact Name!");window.scrollTo(0,0)
    return false;
  }
  if (!clientAssigned.length) {
    if (!isToastDisabled) toast.error("Please assign the Client!");window.scrollTo(0,0)
    return false;
  }
  const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/
    
  if (phonePattern.test(contactPhone) === false) {
    if (!isToastDisabled) toast.error("Please input Onsite Contact Phone!");window.scrollTo(0,0)
    return false;
  }

  return true;
};
