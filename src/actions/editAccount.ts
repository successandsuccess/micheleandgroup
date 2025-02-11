export const EditAccountInfo = async (
  id: string,
  type: string,
  firstName: string,
  lastName: string,
  email: string,
  previousEmail: string,
  cellPhone: string,
  password?: string,
  signature?: string
) => {
  const res = await fetch("/api/edit-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      type,
      firstName,
      lastName,
      email,
      cellPhone,
      password,
      signature,
      previousEmail,
    }),
  });
  // const data = await res.json();
  console.log(res);

  const data = await res.json();
  if (res.status !== 200) return { status: false, data: data };
  return { status: true, data };
};
