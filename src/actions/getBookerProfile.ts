export const GetBookerProfile = async (id: string) => {
    const res = await fetch("/api/get-booker-profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id
        }),
    })
    // const data = await res.json();
    console.log('hihih')
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}