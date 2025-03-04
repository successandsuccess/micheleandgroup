export const EditProfile = async (
  id: string,
  type: string,
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
  previousEmail: string,
  certification?: any,
  certificationDate?: any,
  middleName?: string,
  suffix?: string,
  dba?: string,
  inseam?: any,
  suit?: any,
  minHourly?: any,
  minDaily?: any,
  instagram?: string,
  castingNetworks?: string,
  skills?: any,
  emergencyContact?: any,
  relationShip?: any,
  emergencyCell ?: any
) => {
  const res = await fetch("/api/update-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      type,
      name,
      street1,
      street2,
      city,
      state,
      zip,
      age,
      gender,
      hairColor: Array.from(hairColor).toString(),
      eyeColor: Array.from(eyeColor).toString(),
      ethnicity,
      languages: Array.from(languages),
      height: Array.from(height).toString(),
      waist: Array.from(waist).toString(),
      hips: Array.from(hips).toString(),
      bust: Array.from(bust).toString(),
      shoeSize: Array.from(shoeSize).toString(),
      dressSize: Array.from(dressSize).toString(),
      cellPhone,
      email,
      previousEmail,
      certification: Array.from(certification),
      certificationDate: certificationDate,
      middleName,
      suffix,
      dba,
      inseam: Array.from(inseam).toString(),
      suit: Array.from(suit).toString(),
      minDaily: Array.from(minDaily).toString(),
      minHourly: Array.from(minHourly).toString(),
      instagram,
      castingNetworks,
      skills,
      relationShip,
      emergencyContact,
      emergencyCell
    }),
  });
  // const data = await res.json();
  console.log(res);

  const data = await res.json();
  if (res.status !== 200) return { status: false, data: data };
  return { status: true, data };
};
