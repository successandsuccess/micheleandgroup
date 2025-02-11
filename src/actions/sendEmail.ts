export const SendEmail = async (job_id: string, talent_ids : any, subject: string, message: string, booker_mail: string) => {
    const res = await fetch("/api/send-job-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job_id,
            talent_ids,
            subject,
            message,
            booker_mail
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}