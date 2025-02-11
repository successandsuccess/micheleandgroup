export const UpdateAbout = async (
    content: any
  ) => {
    const res = await fetch("/api/page/update-about-us", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content
      }),
    });
    // const data = await res.json();
    console.log(res);
  
    const data = await res.json();
    if (res.status !== 200) return { status: false, data: data };
    return { status: true, data };
  };
  