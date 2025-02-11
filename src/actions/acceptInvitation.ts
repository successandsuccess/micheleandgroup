export const AcceptInvitation = async (job_id: string, talent_id: string, invitation_pending: any, invitation_accepted: any) => {
    const res = await fetch("/api/accept-invitation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job_id,
            talent_id,
            invitation_pending,
            invitation_accepted
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}