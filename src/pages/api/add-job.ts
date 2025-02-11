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

  var talentInvited: any = [];
  req.body.talentInvited.map((item: any) => talentInvited.push(item.id));
  try {
    const booker_record = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_STAFF_TABLE_ID}/${req.body.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const booker = await booker_record.json();
    const booker_id = booker.fields.Collab.id;
    console.log("hellop!", req.body.talentNote);
    const result = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Bookers: booker.fields.Collab,
                "Type of Event": req.body.eventType,
                "Total # Talent": Number(req.body.talentQuota),
                "JOB TITLE": req.body.eventTitle,
                Status: talentInvited ? "Invite Talent" : "Add to Website",
                // "Event Reference": req.body.eventRef, //missing
                "EVENT DESCRIPTION": req.body.eventDescription,
                "Start Date/Time": new Date(
                  `${req.body.eventDates[0].eventDate}T${req.body.eventDates[0].startTime}:00Z`
                ).toISOString(),
                "End Date/Time": new Date(
                  `${req.body.eventDates[0].eventDate}T${req.body.eventDates[0].endTime}:00Z`
                ).toISOString(),
                Account: [req.body.location],
                "Talent Rate": Number(req.body.talentRate),
                "Client Rate": Number(req.body.talentRate),
                "Agency Fee": req.body.agencyFee,
                Billing: req.body.rateBasis,
                "ONSITE CONTACT NAME": req.body.contactName, //new field
                "ONSITE CONTACT PHONE": req.body.contactPhone, //new field
                UNIFORM: req.body.wardrobe, //new field  missing
                PARKING: req.body.parking, //new field
                "MAKE-UP & HAIR": req.body.makeup, //new field
                "TRAVEL DESCRIPTION": req.body.travel, //new field
                "RECAP DESCRIPTION": req.body.recap, //new field
                "SOCIAL MEDIA": req.body.social, //new field
                "Crawl Breakdown": req.body.additionalLocation, //new field
                REFERRALS: req.body.referrals, //new field
                "TALENT EXPECTATIONS": req.body.talentExpectations, //new field
                // "CANCELLATION DESCRIPTION": req.body.cancellation, //newfield
                CONTACTS: req.body.contacts,
                "MISCELLANEOUS INSTRUCTIONS": req.body.miscellaneous, //new field
                Client: [req.body.clientAssigned],
                "INVITED TALENT": talentInvited,
                "Talent Notes": req.body.talentNote,
              },
            },
          ],
        }),
      }
    );
    const data = await result.json();
    console.log(data);
    await sendJobPendingMessage(
      data.records[0].fields?.["INVITED TALENT"],
      data.records[0].id,
      data.records[0].fields["Type of Event"],
      data.records[0].fields["City"],
      data.records[0].fields["States"],
      data.records[0].fields["JOB TITLE"],
      req.body.booker_mail,
      data.records[0].fields["Start Date/Time"],
      data.records[0].fields["End Date/Time"]
    );
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error!" });
  }
}

const sendJobPendingMessage = async (
  pending: any,
  jobid: string,
  type: string,
  city: string,
  state: string,
  title: string,
  booker_mail: string,
  startTime: string,
  endTime: string
) => {
  if (!pending) return;
  sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "");

  console.log(pending);

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

  for (let i = 0; i < pending?.length; i++) {
    const result = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${pending[i]}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const talent_record = await result.json();
    const talent_mail = talent_record.fields.Email;
    var template: string = dashboard_data[0].Description;

    var header = dashboard_data[0].Header.replaceAll("${title}", title);

    template = template.replaceAll("${title}", title);
    template = template.replaceAll("${type}", type);
    template = template.replaceAll("${city}", city);
    template = template.replaceAll("${state}", state);
    template = template.replaceAll("${jobid}", jobid);
    template = template.replaceAll("${starttime}", startTime);
    template = template.replaceAll("${endtime}", endTime);

    const msg = {
      to: talent_mail, // Change to your recipient
      from: booker_mail, // Change to your verified sender
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
    // await insertLog(
    //   `<a href="${process.env.NEXT_PUBLIC_SERVER_URI}/dashboard/talents/${talent_record.id}">${talent_record.fields["TALENT FULL NAME"]}</a> was invited to a job event for <a href="${process.env.NEXT_PUBLIC_SERVER_URI}/job-board/${jobid}">${title}</a>`
    // );
  }
};
