// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import * as sgMail from "@sendgrid/mail";
import { GetEmailTemplate } from "@/actions/page/getEmailTemplate";
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
  const job = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.job_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const job_data = await job.json();
  const cancel_talent = job_data.fields?.['CANCELLED TALENT'] || [];
  const temp = cancel_talent?.filter((item: any) => item !== req.body.talent_id);
  temp.push(req.body.talent_id);
  console.log(temp);
  const available_talent = job_data.fields?.['Available Talent']?.filter((item : string) => item !== req.body.talent_id);
  console.log(available_talent);
  const unavailable_talent = job_data.fields?.['TALENT NOT AVAILABLE']?.filter((item: string) => item !== req.body.talent_id);
  const pending_talent = job_data.fields?.['INVITED TALENT']?.filter((item: string) => item !== req.body.talent_id);
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
          "Booked Talent": [],
          "Cancel Check": true,
          "ConfirmBooking": "No",
          "Status" : "Cancelled",
          "CANCELLED TALENT" : temp,
          "Available Talent" : available_talent,
          "TALENT NOT AVAILABLE": unavailable_talent,
          "INVITED TALENT" : pending_talent,
        },
      }),
    }
  );
  const data = await job_record.json();
  const talent_record = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${req.body.airtable_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const talent_data = await talent_record.json();
  console.log(talent_data);
  sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "");
  
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

  var template = dashboard_data[3].Description;

  template = template.replaceAll('${booker_name}', data.fields.Bookers.name);

  template = template.replaceAll('${talent_name}',talent_data.fields["TALENT FULL NAME"]);

  template = template.replaceAll('${talentid}', req.body.airtable_id);

  template = template.replaceAll('${title}',data.fields["JOB TITLE"]);

  template = template.replaceAll('${jobid}',req.body.job_id);

  template = template.replaceAll('${starttime}',new Date(
    data.fields["Start Date/Time"]
  ).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }));

  template = template.replaceAll('${endtime}', new Date(data.fields["End Date/Time"]).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }))
  const msg = {
    to: talent_data.fields.Email, // Change to your recipient data.fields.Bookers.email
    from: req.body.booker_mail, // Change to your verified sender
    subject: dashboard_data[3].Header,
    html: `
    <div style="text-align:center; padding-top:50px; padding-bottom: 0px;">
    <img src="https://firebasestorage.googleapis.com/v0/b/dylan-41b3e.appspot.com/o/LOGOS%2FMG%20Logo%202006%20jpg.JPG?alt=media&token=40a36450-f56d-419b-9046-98f65530b97d" alt="Trulli" width="150" >
    </div>
    ${template}
<br/>
    <p style="text-align: center; background-color: #f5f5f5; padding: 10px 0px;">Copyright 2023 Michele & Group, Inc., All Rights Reserved | State License #TA0000236</p>
    `,
  };
  sgMail.send(msg);

  await insertLog(`<a href="${process.env.NEXT_PUBLIC_SERVER_URI}/dashboard/talents/${req.body.airtable_id}" target="_blank">${talent_data.fields["TALENT FULL NAME"]}</a> cancelled a confirmed job event for <a href="${process.env.NEXT_PUBLIC_SERVER_URI}/job-board/${data.id}" target="_blank">${data.fields['JOB TITLE']}</a`);
  

  res.status(200).json({ data });
}
