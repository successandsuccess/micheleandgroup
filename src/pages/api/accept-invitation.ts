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
  const job_record = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.job_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const job_data = await job_record.json();
  const availableTalent = job_data?.fields?.["Available Talent"] || [];
  const pendingTalent = job_data?.fields?.["INVITED TALENT"] || [];
  const unavailableTalent = job_data?.fields?.["TALENT NOT AVAILABLE"] || [];
  const declinedTalent = job_data?.fields?.["DECLINED TALENT"] || [];
  const cancelTalent = job_data?.fields?.["CANCELLED TALENT"] || [];

  const temp_available = availableTalent.filter((item: any) => item !== req.body.talent_id);
  const temp_pending = pendingTalent.filter((item: any) => item !== req.body.talent_id);
  const temp_unavailable = unavailableTalent.filter((item: any) => item !== req.body.talent_id);
  const temp_decline = declinedTalent.filter((item: any) => item !== req.body.talent_id);
  const temp_cancel = cancelTalent.filter((item: any) => item !== req.body.talent_id);

  temp_available.push(req.body.talent_id);

    const result = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.job_id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
            fields:{
              "Available Talent" : temp_available,
              "INVITED TALENT" : temp_pending,
              "TALENT NOT AVAILABLE": temp_unavailable,
              "DECLINED TALENT" : temp_decline,
              "CANCELLED TALENT" : temp_cancel,
            }
        })
      }
    );
    const data = await result.json();
    
    res.status(200).json({ data });
}
