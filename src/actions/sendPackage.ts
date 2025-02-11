export const SendPackage = async (name: string, email: string, message: string, talentInvited: any,booker: string, booker_mail: string, subject?: string, ) => {
    const res = await fetch("/api/send-package", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            message,
            talentInvited,
            booker,
            subject,
            booker_mail
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}