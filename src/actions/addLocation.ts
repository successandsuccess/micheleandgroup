export const AddLocation = async (
    storeName: string,
    address: string,
    city: string,
    state: any,
    zip: string,
    phone: string,
    premise: any
  ) => {
    
    const result  = await fetch("/api/add-location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storeName,
        address,
        city,
        state: state.currentKey,
        zip,
        phone,
        premise: premise.currentKey,
      }),
    });
    const jobs = await result.json();
    return { status: true, data: jobs };
  };
  