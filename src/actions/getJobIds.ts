export const GetJobId = async (id: string) => {
    const res = await fetch("/api/get-job-id", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
  }