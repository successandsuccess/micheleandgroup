export const GetTalents = async (
    talents: string
  ) => {
    
    const result  = await fetch("/api/get-talents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        talents
      }),
    });
    const jobs = await result.json();
    return { status: true, data: jobs };
  };
  