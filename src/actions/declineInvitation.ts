export const DeclineInvitation = async (job_id: string, talent_id: string, invitation_pending: any, invitation_declined: any, booker_mail: any) => {
    const res = await fetch("/api/decline-invitation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job_id,
            talent_id,
            invitation_pending,
            invitation_declined,
            booker_mail
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}