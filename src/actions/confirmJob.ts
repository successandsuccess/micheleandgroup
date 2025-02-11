export const ConfirmJob = async (job_id: string, ip: string, talent_id: string) => {
    const res = await fetch("/api/confirm-job", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job_id,
            ip,
            talent_id
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}