// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const talent_record = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${req.body.id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );

  const talent = await talent_record.json();
  const result = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}?filterByFormula=FIND("${talent.fields?.["TALENT FULL NAME"]}",{INVITED TALENT})&fields[]=Available Talent&fields[]=TALENT NOT AVAILABLE&fields[]=DECLINED TALENT&fields[]=TITLE W DATE&fields[]=Talent Rate&fields[]=Billing`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const data = await result.json();
  const available_record = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}?filterByFormula=FIND("${talent.fields?.["TALENT FULL NAME"]}",{Available Talent})&fields[]=Available Talent&fields[]=TALENT NOT AVAILABLE&fields[]=DECLINED TALENT&fields[]=TITLE W DATE&fields[]=Talent Rate&fields[]=Billing`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const available_jobs = await available_record.json();
  const cancelled_record = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}?filterByFormula=FIND("${talent.fields?.["TALENT FULL NAME"]}",{CANCELLED TALENT})&fields[]=Available Talent&fields[]=TALENT NOT AVAILABLE&fields[]=DECLINED TALENT&fields[]=TITLE W DATE&fields[]=Talent Rate&fields[]=Billing`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const cancelled_jobs = await cancelled_record.json();
  const declined_record = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}?filterByFormula=FIND("${talent.fields?.["TALENT FULL NAME"]}",{DECLINED TALENT})&fields[]=Available Talent&fields[]=TALENT NOT AVAILABLE&fields[]=DECLINED TALENT&fields[]=TITLE W DATE&fields[]=Talent Rate&fields[]=Billing`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const declined_jobs = await declined_record.json();

  res.status(200).json({ data, available_jobs, cancelled_jobs, declined_jobs });
}
