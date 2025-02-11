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

  var talentInvited: any = [];
  console.log("1");
  req.body.talentInvited.map((item: any) => talentInvited.push(item.id));
  console.log(talentInvited);
  try {
    const job_record = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const job_data = await job_record.json();

    //job_data.fields?.["TALENT NOT AVAILABLE"];
    var talent_pending: any = [];
    talentInvited.map((item: any) => {
      if (!job_data.fields?.["INVITED TALENT"]?.includes(item))
        talent_pending.push(item);
    });

    var talent_invited = job_data.fields?.["INVITED TALENT"] || [];

    console.log(talent_pending);
    if (talent_invited.length)
      talent_invited = talent_invited.concat(talent_pending);
    else talent_invited = talent_pending;

    console.log("here");

    const result = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "INVITED TALENT": talent_invited,
          },
        }),
      }
    );
    const data = await result.json();

    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "");
    const pending_filter =
      "filterByFormula=OR(" +
      talent_pending.map((id: string) => `RECORD_ID()='${id}'`).join(", ") +
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
    const talents = await pending_invite.json();
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

    talents?.records?.map((item: any) => {
      var template: string = dashboard_data[0].Description;

      template = template.replaceAll("${title}", data.fields?.["JOB TITLE"]);
      template = template.replaceAll("${type}", data.fields?.["Type of Event"]);
      template = template.replaceAll("${city}", data.fields?.["City"]);
      template = template.replaceAll("${state}", data.fields?.["States"]);
      template = template.replaceAll("${jobid}", req.body.id);
      template = template.replaceAll("${starttime}", data.fields?.['Start Date/Time']);
      template = template.replaceAll("${endtime}", data.fields?.['End Date/Time']);
      var header = dashboard_data[0].Header.replaceAll("${title}", data.fields?.["JOB TITLE"]);

      const msg = {
        to: item.fields.Email, //item.fields.Email, // Change to your recipient
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
    });

    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error!" });
  }
}
