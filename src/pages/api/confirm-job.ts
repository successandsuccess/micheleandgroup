// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import * as sgMail from "@sendgrid/mail";
import { insertLog } from "@/utils/airtable/airtable.service";

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
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "ConfirmBooking" : "Yes",
          "Status" : "Talent Confirmed",
          "IP FOR CONFIRMATION": req.body.ip
        },
      }),
    }
  );
  const data = await job_record.json();

  const talent_record = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${req.body.talent_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
     
    }
  );

  const talent_data = await talent_record.json();

  await insertLog(`<a href="${process.env.NEXT_PUBLIC_SERVER_URI}/dashboard/talents/${req.body.talent_id}" target="_blank">${talent_data.fields["TALENT FULL NAME"]}</a> confirmed to a job event for <a href="${process.env.NEXT_PUBLIC_SERVER_URI}/job-board/${data.id}" target="_blank">${data.fields['JOB TITLE']}</a`);
  res.status(200).json({ data });
}
