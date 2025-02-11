export const GetAccountInformation = async (id: string, type: string) => {
    const res = await fetch("/api/get-account", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
            type
        }),
    })
    // const data = await res.json();
    console.log('hihih')
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}