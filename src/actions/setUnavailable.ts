export const SetUnAvailable = async (job_id: string, talent_id: string, available: any, unavailable: any) => {
    const res = await fetch("/api/set-unavailable", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job_id,
            talent_id,
            available,
            unavailable,
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}