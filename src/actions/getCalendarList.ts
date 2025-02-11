export const GetCalendarList = async (id: string, type: string) => {
  const res =
    type === "talent"
      ? await fetch("/api/talent/calendar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        })
      : await fetch("/api/booker/calendar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
  // const data = await res.json();
  if (res.status !== 200)
    return { status: false, message: "Internal Sever Error!" };
  const data = await res.json();
  return { status: true, data };
};
