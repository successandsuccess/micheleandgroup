// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import * as sgMail from "@sendgrid/mail";

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

  temp_decline.push(req.body.talent_id);
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


    const hero_record = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_PAGE_CONTENT_TABLE_ID}?filterByFormula={Name} = 'Email Template'`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const hero_data = await hero_record.json();
    const dashboard_data = await JSON.parse(
      hero_data?.records?.[0]?.fields?.Data
    );
    var template = dashboard_data[2].Description;
    template = template.replaceAll("${title}", job_data.fields["JOB TITLE"]);

    template = template.replaceAll(
      "${starttime}",
      new Date(job_data.fields["Start Date/Time"])
        .toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        })
        .replace("at", "")
    );
    template = template.replaceAll(
      "${endtime}",
      new Date(job_data.fields["End Date/Time"])
        .toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        })
        .replace("at", "")
    );

    template = template.replaceAll("${city}", job_data.fields["City"]);

    template = template.replaceAll("${state}", job_data.fields?.["States"]);
    var header = dashboard_data[2].Header.replaceAll("${title}", job_data.fields?.["JOB TITLE"]);
    const msg = {
      to: talent_data?.fields?.['Email'], // Change to your recipient
      from: req.body.booker_mail, // Change to your verified sender
      subject: header,
      text: "which contains some text",
      html: `<div style="text-align:center; padding-top:50px; padding-bottom: 0px;">
    <img src="https://firebasestorage.googleapis.com/v0/b/dylan-41b3e.appspot.com/o/LOGOS%2FMG%20Logo%202006%20jpg.JPG?alt=media&token=40a36450-f56d-419b-9046-98f65530b97d" alt="Trulli" width="150" >
    </div>
    ${template}
<br/>
    <p style="text-align: center; background-color: #f5f5f5; padding: 10px 0px;">Copyright 2023 Michele & Group, Inc., All Rights Reserved | State License #TA0000236</p>`,
    };
    sgMail.send(msg);
    
    res.status(200).json({ data });
}
