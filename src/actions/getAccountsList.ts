export const GetAccountsList = async (search: string) => {
    const res = await fetch("/api/get-accounts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            search
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}