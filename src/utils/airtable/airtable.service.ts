import { updateUser } from "@/lib/firebaseadmin";
import Airtable from "airtable";

const AIRTABLE_BASE_URL = "https://api.airtable.com/v0/";

const MGTalent = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_ID || "");

const MGBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID || "");

export const requestOptions = {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
    "content-type": "application/json",
  },
};

export const getTalentById = async (talentId: string) => {
  try {
    // const talent = await airtable.table.talent.find(talentId);
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${talentId}`,
      requestOptions
    );
    const result = await res.json();
    // console.log('getTalentById - talent', talent)
    if (!result) return null;
    return result;
  } catch (error) {
    console.log(error);
  }
};

interface AirtableResponse {
  records: [];
  offset?: string;
}

interface SelectOptions {
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;
  offset?: string;
  view?: string;
  fields?: string[];
}
type ToParamBody = any;

function buildParams(prefix: any, obj: any, addFn: any) {
  if (Array.isArray(obj)) {
    // Serialize array item.
    for (let index = 0; index < obj.length; index++) {
      const value = obj[index];
      if (/\[\]$/.test(prefix)) {
        // Treat each array item as a scalar.
        addFn(prefix, value);
      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(
          `${prefix}[${
            typeof value === "object" && value !== null ? index : ""
          }]`,
          value,
          addFn
        );
      }
    }
  } else if (typeof obj === "object") {
    // Serialize object item.
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      buildParams(`${prefix}[${key}]`, value, addFn);
    }
  } else {
    // Serialize scalar item.
    addFn(prefix, obj);
  }
}

export function objectToQueryParamString(obj: ToParamBody): string {
  const parts: any = [];
  const addFn = (key: any, value: any) => {
    value = value ?? "";
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  };

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    buildParams(key, value, addFn);
  }

  return parts.join("&").replace(/%20/g, "+");
}

export const runCustomList = async (
  selectOptions: SelectOptions,
  baseId: string,
  tableId: string,
  fields?: string[],
  sort?: string
): Promise<AirtableResponse> => {
  try {
    // console.log('runCustomList selectOptions', selectOptions)
    const queryParamString = objectToQueryParamString(selectOptions);
    let url = `${AIRTABLE_BASE_URL}${baseId}/${tableId}?${queryParamString}`
    if (fields)
      fields.map((item: string) => {
        url += `&fields[]=${item}`;
      });
    if (sort) {
      url += `&sort[0][field]=${sort}&sort[0][direction]=asc`;
    }
    console.log("URL", url);
    const res = await fetch(url, requestOptions);
    const result = await res.json();
    // console.log(result);
    return result;
  } catch (err) {
    console.log("runCustomList err", err);
    return {
      records: [],
    };
  }
};

export const listBookings = (
  selectOptions: SelectOptions,
  fields?: string[],
  sort?: string
) => {
  return runCustomList(
    selectOptions,
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID || "",
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID || "",
    fields,
    sort
  );
};

export const getBookings = async (
  options = {},
  fields?: string[],
  sort?: string
) => {
  try {
    const defaultOptions = {
      // view: "ALL BOOKINGS",
    };
    const selectOptions = {
      ...defaultOptions,
      ...options,
    };
    const bookings = await listBookings(selectOptions, fields, sort);
    return bookings?.records;
  } catch (error) {
    console.log(error);
  }
};

export const getTalentBookedBookings = async ({
  talentId,
  startDate,
  endDate,
  fields,
}: {
  talentId: string;
  startDate?: string;
  endDate?: string;
  fields?: string[];
}) => {
  const filterFormulaArr = [];
  if (talentId) {
    // Must get talent record to get talent name
    const talent = await getTalentById(talentId);
    // Booked Talent is a linked field, so we need to search for the talent name, which is Talent table primary field.
    // filterFormulaArr.push(
    //   `SEARCH('${talent.fields.Name}', (ARRAYJOIN({Booked Talent}, ' ')))`
    // );
    filterFormulaArr.push(
      `FIND("${talent.fields["TALENT FULL NAME"]}",{Booked Talent})`
    );
  }
  if (startDate) {
    filterFormulaArr.push(
      `IS_AFTER({Start Date/Time}, DATETIME_PARSE('${startDate}'))`
    );
  }
  if (endDate) {
    filterFormulaArr.push(
      `IS_BEFORE({Start Date/Time}, DATETIME_PARSE('${endDate}'))`
    );
  }
  const selectOptions: any = {};
  if (filterFormulaArr.length > 0) {
    let filterFormula = `AND(${filterFormulaArr.join(",")})`;
    selectOptions["filterByFormula"] = filterFormula;
  }
  return getBookings(selectOptions, fields);
};

export const getJobsOfBooker = async (bookerId: string, fields?: string[]) => {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_STAFF_TABLE_ID}/${bookerId}`,
    requestOptions
  );
  const result = await res.json();
  const bookerName = result.fields["Name"];
  console.log(bookerName);
  return getBookings(
    { filterByFormula: `{Booker_name} = '${bookerName}'` },
    fields,
    "Start Date/Time"
  );
};
const listJobs = (selectOptions: SelectOptions, sort?: string) => {
  return runCustomList(
    selectOptions,
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID || "",
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID || "",
    [],
    sort
  );
};

export const getBookedJobs = async (options = {}, sort?: string) => {
  try {
    // const defaultOptions = {
    //   view: process.env.NEXT_PUBLIC_BOOKINGS_TABLE_VIEW,
    // };
    const selectOptions = {
      // ...defaultOptions,
      ...options,
    };
    const talents = await listJobs(selectOptions, sort);
    return talents;
  } catch (error) {
    console.log(error);
  }
};

const listClient = (selectOptions: SelectOptions, sort?: string) => {
  return runCustomList(
    selectOptions,
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID || "",
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_CLIENTS_TABLE_ID || "",
    [],
    sort
  );
};

export const getClients = async (options = {}, sort?: string) => {
  try {
    // const defaultOptions = {
    //   view: process.env.NEXT_PUBLIC_CLIENTS_TABLE_VIEW,
    // };
    const selectOptions = {
      // ...defaultOptions,
      ...options,
    };
    const talents = await listClient(selectOptions, sort);
    return talents;
  } catch (error) {
    console.log(error);
  }
};

const isEmailExist = async (type: string, email: string) => {
  if (!email) return false;
  const talentExist = await MGBase(
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID || ""
  )
    .select({
      filterByFormula: `AND({Email} = '${email}')`,
    })
    .firstPage();
  const bookerExist = await MGBase(
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_STAFF_TABLE_ID || ""
  )
    .select({
      filterByFormula: `AND({Email} = '${email}')`,
    })
    .firstPage();
  const clientExist = await MGBase(
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_CLIENTS_TABLE_ID || ""
  )
    .select({
      filterByFormula: `AND({Email} = '${email}')`,
    })
    .firstPage();
  if (!talentExist.length && !bookerExist.length && !clientExist.length)
    return false;
  return true;
};

export const insertLog = async (text: string) => {
  try {
    const data = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Log: text,
              "Last Modified Time": new Date().toISOString(),
            },
          },
        ],
      }),
    };
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_SUPPORT_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_LOG_TABLE_ID}`,
      data
    );
    const temp = await res.json();
    console.log(temp);
  } catch (error) {
    console.log(error);
  }
};

export const editTalentAccount = async (
  talentId: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  cellPhone: string,
  emailSignature: string,
  previousEmail: string
) => {
  if ((await isEmailExist("talent", email)) && email !== previousEmail)
    return { status: false, message: "This email is already in use." };
  if (password || previousEmail !== email) {
    //
    //
    await updateUser(previousEmail, email, password);
  }
  try {
    let updateField: any = {
      Email: email,
      "Cell Phone": cellPhone,
      Password: password,
      "TALENT FIRST NAME": firstName,
      "TALENT LAST NAME": lastName,
    };
    if (email && previousEmail !== email) updateField["Email"] = email;
    if (password) updateField["Password"] = password;
    const data = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: updateField }),
    };
    console.log(process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_ID);
    const talent_record = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_TALENT_TABLE_ID}?filterByFormula=AND({Email} = '${previousEmail}')`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const talent_data = await talent_record.json();
    const talent_id = talent_data.records[0].id;
    await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_TALENT_TABLE_ID}/${talent_id}`,
      data
    );
    // await insertLog(`${firstName} ${lastName} has edited the account.`);
    return { status: true, message: "Profile Edited Successfully!" };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Internal Server Error" };
  }
};

export const editTalentProfile = async (talentId: string, profiledata: any) => {
  try {
    if (await isEmailExist("talent", profiledata.Email))
      return { status: false, message: "This email is already in use." };
    console.log(profiledata);
    const data = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: profiledata,
        typecast: true,
      }),
    };

    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_TALENT_TABLE_ID}/${talentId}`,
      data
    );
    const result = await res.json();
    console.log(result);
    await insertLog(
      `${profiledata["TALENT FIRST NAME"]} ${profiledata["TALENT LAST NAME"]} has edited the profile.`
    );
    return { status: true, message: "Profile Edited Successfully!" };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Internal Server Error!" };
  }
};

export const addTalent = async (profiledata: any) => {
  try {
    if (await isEmailExist("talent", profiledata.Email))
      return { status: false, message: "This email is already in use." };
    console.log(profiledata);
    const data = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: profiledata,
          },
        ],
      }),
    };
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}`,
      data
    );
    const result = await res.json();
    await insertLog(
      `${profiledata["TALENT FIRST NAME"]} ${profiledata["TALENT LAST NAME"]} was added.`
    );
    return { status: true, message: "Talent Added Successfully!" };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Internal Server Error!" };
  }
};

export const addClient = async (profiledata: any) => {
  try {
    if (await isEmailExist("talent", profiledata.Email))
      return { status: false, message: "This email is already in use." };
    const data = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: profiledata,
          },
        ],
      }),
    };
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_CLIENTS_TABLE_ID}`,
      data
    );
    const result = await res.json();
    // await insertLog(`${profiledata["Company"]} was added.`);
    // console.log(result);
    // result.records[0].id
    const booker = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_CLIENTS_TABLE_ID}/${profiledata['Booker'][0]}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const booker_data = await booker.json();
    console.log(booker_data);
    const clients = booker_data.fields.Clients;
    clients.push(result.records[0].id);
    await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${booker_data.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Clients: clients,
          },
          typecast: true,
        }),
      }
    );
    return { status: true, message: "Talent Added Successfully!" };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Internal Server Error!" };
  }
};

export const editBookerAccount = async (
  talentId: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  cellPhone: string,
  emailSignature: string,
  previousEmail: string
) => {
  if ((await isEmailExist("booker", email)) && email !== previousEmail)
    return { status: false, message: "This email is already in use." };
  try {
    if (password || previousEmail !== email) {
      //
      //
      await updateUser(previousEmail, email, password);
    }
    let updateField: any = {
      Email: email,
      "Cell Phone": cellPhone,
      Password: password,
      Name: firstName + " " + lastName,
    };
    if (email && previousEmail !== email) updateField["Email"] = email;
    if (password) updateField["Password"] = password;
    const data = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: updateField }),
    };
    const result = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_STAFF_TABLE_ID}/${talentId}`,
      data
    );
    const res = await result.json();
    // await insertLog(`${firstName} ${lastName} has edited the profile.`);
    return { status: true, message: "Profile Edited Successfully!" };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Internal Server Error" };
  }
};

export const getStaffData = async (recordId: string) => {
  try {
    console.log(recordId);
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_STAFF_TABLE_ID}/${recordId}`,
      requestOptions
    );
    const data = await res.json();
    // const data = await airtable.table.staff.find(recordId)
    // TODO: Confirm the format of returned data, i.e., data.fields
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    // throw error
  }
};

const listTalent = (selectOptions: SelectOptions) => {
  return runCustomList(
    selectOptions,
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID || "",
    process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID || ""
  );
};

export const getTalent = async (options = {}) => {
  try {
    const defaultOptions = {
      view: process.env.NEXT_PUBLIC_ACTIVE_TALENT_TABLE_VIEW,
    };
    const selectOptions = {
      ...defaultOptions,
      ...options,
    };
    const talents = await listTalent(selectOptions);
    return talents;
  } catch (error) {
    console.log(error);
  }
};
