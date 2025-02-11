export const BookTalent = async (job_id: string, talent_id: string, booker_mail: string) => {
    const res = await fetch("/api/book-talent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job_id,
            talent_id,
            booker_mail
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}