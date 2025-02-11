import { getBookedJobs } from "@/utils/airtable/airtable.service";

export const SearchTalent = async (
  name: string,
  gender: any,
  talentType: any,
  fromAge: string,
  toAge: string,
  majorCity: string,
  hairColor: any,
  eyeColor: any,
  fromHeight: any,
  toHeight: any,
  fromShoeSize: any,
  toShoeSize: any,
  fromDressSize: any,
  toDressSize: any,
  language: any,
  ethnicity: any,
  offset: any,
  pageSize: any,
  city: string,
  tags?: any,
  bookings?: any,
  zip?: any,
  distance?: any,
  state?: any,
  rating?: any,
  status?: any,
  
) => {
  const result = await fetch("/api/talent/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      gender,
      talentType,
      fromAge,
      toAge,
      majorCity,
      hairColor,
      eyeColor,
      fromHeight,
      toHeight,
      fromShoeSize,
      toShoeSize,
      fromDressSize,
      toDressSize,
      language,
      ethnicity,
      offset,
      pageSize,
      city,
      tags: Array.from(tags),
      bookings: Array.from(bookings),
      zip,
      distance,
      state: Array.from(state).toString(),
      rating: Array.from(rating),
      status: Array.from(status)
    }),
  });
  const talents = await result.json();
  
  return { status: true, data: talents };
};
