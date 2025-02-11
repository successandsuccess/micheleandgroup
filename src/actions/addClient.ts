export const AddClient = async (
    name :string,
      email :string,
      fax :string,
      booker :any,
      street1 :string,
      street2 :string,
      city :string,
      state :any,
      zip :string,
      contactName1 :string,
      contactPhone1 :string,
      contactName2 :string,
      contactPhone2 :string
  ) => {
    const res = await fetch("/api/add-client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      email,
      fax,
      booker: Array.from(booker).toString(),
      street1,
      street2,
      city,
      state: Array.from(state).toString(),
      zip,
      contactName1,
      contactPhone1,
      contactName2,
      contactPhone2
      }),
    });
    // const data = await res.json();
    console.log(res);
  
    const data = await res.json();
    if (res.status !== 200) return { status: false, data: data };
    return { status: true, data };
  };
  