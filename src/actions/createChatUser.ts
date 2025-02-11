export const CreateChatUser = async (id: string, name: string, email: string, type: string) => {
    const res = await fetch("/api/create-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
            name,
            email,
            type
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}