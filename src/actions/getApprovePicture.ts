export const GetApprovePicture = async () => {
    const hero_record = await fetch("/api/get-pictures", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const hero_data = await hero_record.json();
    return { status: true, data: hero_data };
  };
  