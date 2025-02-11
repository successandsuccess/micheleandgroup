export const login = async (email: string, password: string) => {
    const res = await fetch("/api/authentication", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password
        }),
    })
    console.log("result",res);
    if(res.status === 200)  return true;
    else return false;
}