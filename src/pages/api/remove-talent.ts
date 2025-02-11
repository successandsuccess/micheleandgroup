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

  const result = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.job_id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const data = await result.json();

  const available_talents = data?.fields?.["Available Talent"];
  const unavailable_talents = data?.fields?.["TALENT NOT AVAILABLE"];
  const invited_talents = data?.fields?.["INVITED TALENT"];
  const declined_talents = data?.fields?.["DECLINED TALENT"];
  const cancel_talents = data?.fields?.['CANCELLED TALENT'];
  const booked_talents = data?.fields?.['Booked Talent'];

  const available = available_talents?.filter((item: string) => item!== req.body.talent_id);
  const unavailable = unavailable_talents?.filter((item: string) => item !== req.body.talent_id);
  const invited = invited_talents?.filter((item: string) => item !== req.body.talent_id);
  const declined = declined_talents?.filter((item: string) => item !== req.body.talent_id);
  const cancel = cancel_talents?.filter((item: string) => item !== req.body.talent_id);
  const booked = booked_talents?.filter((item: string) => item !== req.body.talent_id);

  const record = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.job_id}`,
    {
        method:"PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fields: {
            "Available Talent" : available,
            "TALENT NOT AVAILABLE" : unavailable,
            "INVITED TALENT" : invited,
            "DECLINED TALENT" : declined,
            "CANCELLED TALENT" : cancel,
            "Booked Talent": booked
        }
      })
    }
  );
  const temp_data = await record.json();

  console.log(temp_data);
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

  const talent_result = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${req.body.talent_id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const talent_record = await talent_result.json();
  const talent_mail = talent_record.fields.Email;
  var template: string = dashboard_data[4].Description;

  var header = dashboard_data[4].Header.replaceAll("${title}", data?.fields?.['JOB TITLE']);

  template = template.replaceAll("${title}", data?.fields?.['JOB TITLE']);
  template = template.replaceAll(
    "${starttime}",
    new Date(data.fields["Start Date/Time"])
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
    new Date(data.fields["End Date/Time"])
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

  template = template.replaceAll("${city}", data.fields["City"]);

  template = template.replaceAll("${state}", data.fields?.["States"]);

  console.log('talent-mail', talent_mail);
  const msg = {
    to: talent_mail, // Change to your recipient
    from: req.body.booker_mail, // Change to your verified sender
    subject: header,
    html: `
    <div style="text-align:center; padding-top:50px; padding-bottom: 0px;">
    <img src="https://firebasestorage.googleapis.com/v0/b/dylan-41b3e.appspot.com/o/LOGOS%2FMG%20Logo%202006%20jpg.JPG?alt=media&token=40a36450-f56d-419b-9046-98f65530b97d" alt="Trulli" width="150" >
    </div>
    ${template}
    <br/>
    <p style="text-align: center; background-color: #f5f5f5; padding: 10px 0px;">Copyright 2023 Michele & Group, Inc., All Rights Reserved | State License #TA0000236</p>`,
  };
  sgMail.send(msg);

  res
    .status(200)
    .json({});
}
