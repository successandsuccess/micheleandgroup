// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import * as sgMail from "@sendgrid/mail";
import { GetEmailTemplate } from "@/actions/page/getEmailTemplate";

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
  console.log('delete-job : ', req.body)
  const result = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.job_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const data = await result.json();
  await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.job_id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
      body:JSON.stringify({
        "fields":{
          'Status': "JOB CANCELLED"
        }
      })
    }
  );
  // console.log(data);

  const notBooked = data?.fields?.["Available Talent"];
  if (notBooked) {
    const pending_filter =
      "filterByFormula=OR(" +
      notBooked?.map((id: string) => `RECORD_ID()='${id}'`).join(", ") +
      ")";
    const pending_invite = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}?${pending_filter}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const talent_pending = await pending_invite.json();
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
    var template = dashboard_data[4].Description;
    template = template.replaceAll("${title}", data.fields["JOB TITLE"]);
    console.log('template',template )

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
    // console.log(template)
    var header = dashboard_data[4].Header.replaceAll("${title}", data.fields?.["JOB TITLE"]);
    talent_pending?.records?.map((item: any) => {
      console.log('message sent to :', item.fields.Email, "from :", req.body.booker_mail )
      const msg = {
        to: item.fields.Email, // Change to your recipient
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
    });
  }
  res.status(200).json({ data });
}
