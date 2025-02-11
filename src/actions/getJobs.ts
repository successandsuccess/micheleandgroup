export const GetJobs = async (
  id: string,
  type: string,
  items_per_page: string,
  search: string,
  city: string,
  state: any,
  fromDate?: any,
  toDate?: any,
  eventType?: any,
  booker?: any,
  offset?: string
) => {
  const result = await fetch("/api/availablejobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      type,
      items_per_page,
      search: search,
      offset,
      city,
      state: Array.from(state).toString(),
      fromDate,
      toDate,
      eventType: Array.from(eventType).toString(),
      search_booker_name: Array.from(booker).toString(),
    }),
  });
  const jobs = await result.json();
  return { status: true, data: jobs };
};
