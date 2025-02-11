export const UploadPhoto = async (
    id: string,
    url: string,
  ) => {
    const res = await fetch("/api/upload-photo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        url,
      }),
    });
    // const data = await res.json();
    console.log(res);
  
    const data = await res.json();
    if (res.status !== 200) return { status: false, data: data };
    return { status: true, data };
  };
  