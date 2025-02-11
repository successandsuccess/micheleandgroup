import { getBookedJobs } from "@/utils/airtable/airtable.service";

export const SearchJob = async (
  id: string,
  title: string,
  fromDate: string,
  toDate: string,
  offset: string,
  items_per_page: any,
  clients?: any,
  status?: any,

) => {
  const result = await fetch("/api/job-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        id,
        title,
        fromDate,
        toDate,
        offset,
        client: clients,
        items_per_page: Array.from(items_per_page)[0],
        status
    }),
  });
  const jobs = await result.json();
  
  return { status: true, data: jobs };
};
