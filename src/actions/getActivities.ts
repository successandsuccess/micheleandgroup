export const GetActivities = async (items_per_page: string, search: string, offset?: string) => {
    const res = await fetch("/api/get-activities", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items_per_page,
            offset,
            search
        }),
    })
    // const data = await res.json();
    if(res.status !== 200)  return {status: false, message: 'Internal Sever Error!'};
    const data = await res.json();
    return {status: true, data}
}