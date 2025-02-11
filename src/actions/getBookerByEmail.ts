export const GetBookerByEmail = async (
    email: string
  ) => {
    
    const result  = await fetch("/api/get-booker-by-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email
      }),
    });
    const jobs = await result.json();
    return { status: true, data: jobs };
  };
  