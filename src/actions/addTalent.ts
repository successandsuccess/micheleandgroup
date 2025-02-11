export const AddTalent = async (
    type: any,
    name: string,
    street1: string,
    street2: string,
    city: string,
    state: string,
    zip: string,
    age: number,
    gender: any,
    hairColor: any,
    eyeColor: any,
    ethnicity: any,
    languages: any,
    height: any,
    waist: any,
    hips: any,
    bust: any,
    shoeSize: any,
    dressSize: any,
    cellPhone: string,
    email: string,
  ) => {
    const res = await fetch("/api/add-talent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type:Array.from(type).toString(),
        name,
        street1,
        street2,
        city,
        state,
        zip,
        age,
        gender: Array.from(gender).toString(),
        hairColor: Array.from(hairColor).toString(),
        eyeColor: Array.from(eyeColor).toString(),
        ethnicity: Array.from(ethnicity).toString(),
        languages: Array.from(languages),
        height: Array.from(height).toString(),
        waist: Array.from(waist).toString(),
        hips: Array.from(hips).toString(),
        bust: Array.from(bust).toString(),
        shoeSize: Array.from(shoeSize).toString(),
        dressSize: Array.from(dressSize).toString(),
        cellPhone,
        email
      }),
    });
    // const data = await res.json();
    console.log(res);
  
    const data = await res.json();
    if (res.status !== 200) return { status: false, data: data };
    return { status: true, data };
  };
  