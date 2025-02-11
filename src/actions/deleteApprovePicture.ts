export const DeleteApprovePicture = async (id: string, url: string) => {
    const hero_record = await fetch("/api/delete-pictures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        url
      })
    });
  
    const hero_data = await hero_record.json();
    return { status: true, data: hero_data };
  };
  