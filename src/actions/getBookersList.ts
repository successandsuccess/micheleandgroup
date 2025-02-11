export const GetBookersList = async () => {
    const res = await fetch("/api/get-bookers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}