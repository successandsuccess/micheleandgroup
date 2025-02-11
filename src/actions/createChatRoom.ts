export const CreateChatRoom = async (
  job: string,
  talent: string,
  client: string,
  booker: string,
  job_name: string
) => {
  const res = await fetch("/api/create-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job,
      talent,
      client,
      booker,
      job_name,
    }),
  });
  // const data = await res.json();
  if (res.status !== 200)
    return { status: false, message: "Internal Sever Error!" };
  const data = await res.json();
  return { status: true, data };
};
