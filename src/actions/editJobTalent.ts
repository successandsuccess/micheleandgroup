export const EditJobTalent = async (
    id: string,
    talentInvited: any,
    booker_mail: string
  ) => {
    const res = await fetch("/api/edit-job-talent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        talentInvited,
        booker_mail
      }),
    });
    // const data = await res.json();
    console.log(res);
  
    const data = await res.json();
    if (res.status !== 200) return { status: false, data: data };
    return { status: true, data };
  };
  