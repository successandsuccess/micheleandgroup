export const GetBookedJobs = async (
    id: string,
    type: string,
    option: string,
    items_per_page?: string,
    search?: string,
    offset?: string
  ) => {
    
    const result  = await fetch("/api/get-booked-jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id, type, items_per_page, search, offset, option
      }),
    });
    const jobs = await result.json();
    return { status: true, data: jobs };
  };
  