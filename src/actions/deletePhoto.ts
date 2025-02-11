export const DeletePhoto = async (
    id: string,
    url: any,
  ) => {
    const res = await fetch("/api/delete-photo", {
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
  