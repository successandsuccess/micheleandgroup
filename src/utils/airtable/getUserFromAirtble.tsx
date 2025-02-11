import Airtable from "airtable";

const MGTalent = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_ID || "");

const MGBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID || "");

export const getUserFromAirtble = async (email: string, password: string) => {
  try {
    const talent_records = await fetch(
      `https://api.airtable.com/v0/${
        process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID
      }/${
        process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID
      }/?filterByFormula=AND(LOWER({Email}) = '${email.toLowerCase()}', {Password} = '${password}')`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const talent = await talent_records.json();
    const booker_record = await fetch(
      `https://api.airtable.com/v0/${
        process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID
      }/${
        process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_STAFF_TABLE_ID
      }/?filterByFormula=AND(LOWER({Email}) = '${email.toLowerCase()}', {Password} = '${password}')`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const booker = await booker_record.json();

    const client_record = await fetch(
      `https://api.airtable.com/v0/${
        process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID
      }/${
        process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_CLIENTS_TABLE_ID
      }/?filterByFormula=AND(LOWER({Email}) = '${email.toLowerCase()}', {PASSWORD} = '${password}')`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );

    const client = await client_record.json();
    if (talent?.records?.length) {
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago",
      });
      const res = await fetch(
        `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${talent.records[0].id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              "LAST LOGIN DATE/TIME": currentDate,
            },
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      return {
        status: true,
        message: "User exists!",
        user: {
          email: talent.records[0].fields.Email,
          username: talent.records[0].fields.Name,
          password: talent.records[0].fields.Password,
          airtable_id: talent.records[0].id,
          type: "talent",
        },
      };
    }
    if (client?.records?.length)
      return {
        status: true,
        message: "User exists!",
        user: {
          email: client.records[0].fields.Email,
          username: client.records[0].fields["Company"],
          password: client.records[0].fields.Password,
          airtable_id: client.records[0].id,
          type: "client",
        },
      };
    console.log(booker?.records);
    if (booker?.records?.length)
      if (booker.records[0].fields.Name === "Admin")
        return {
          status: true,
          message: "User exists!",
          user: {
            email: booker.records[0].fields.Email,
            username: booker.records[0].fields.Name,
            password: booker.records[0].fields.Password,
            airtable_id: booker.records[0].id,
            type: "admin",
          },
        };
      else
        return {
          status: true,
          message: "User exists!",
          user: {
            email: booker.records[0].fields.Email,
            username: booker.records[0].fields.Name,
            password: booker.records[0].fields.Password,
            airtable_id: booker.records[0].id,
            type: "booker",
          },
        };
    return {
      status: false,
      message: "Email and password is incorrect!",
    };
  } catch (e) {}
  return { status: false, message: "Email and password is incorrect!" };
};
