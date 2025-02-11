export const GetApprovePictureById = async (id: string) => {
    const hero_record = await fetch("/api/get-pictures-by-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id
      })
    });
  
    const hero_data = await hero_record.json();
    return { status: true, data: hero_data };
  };
  