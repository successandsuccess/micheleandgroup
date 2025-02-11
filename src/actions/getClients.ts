export const GetClients = async (
    id: string,
    type: string,
    items_per_page: string,
    search: string,
    // city: string,
    // state: any,
    offset?: string
  ) => {
    
    const result  = await fetch("/api/search-clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id, type, items_per_page, search: search, offset, 
        // city, state: Array.from(state).toString()
      }),
    });
    const jobs = await result.json();
    return { status: true, data: jobs };
  };
  