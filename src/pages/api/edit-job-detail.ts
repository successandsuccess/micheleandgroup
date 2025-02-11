// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
// import * as sgMail from "@sendgrid/mail";

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
  try {
    console.log(1);
    console.log(req.body.jobStatus)
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
                "Type of Event": req.body.eventType,
                "Total # Talent": Number(req.body.talentQuota),
                "JOB TITLE": req.body.eventTitle,
                // eventRef,
                "Event Reference" : req.body.eventRef,
                "EVENT DESCRIPTION": req.body.eventDescription,
                "Start Date/Time": new Date(
                  `${req.body.eventDates[0].eventDate}T${req.body.eventDates[0].startTime}:00Z`
                ).toISOString(),
                "End Date/Time": new Date(
                  `${req.body.eventDates[0].eventDate}T${req.body.eventDates[0].endTime}:00Z`
                ).toISOString(),
                // requiredAttendDay,
                "Account" : [location],
                "Talent Rate": Number(req.body.talentRate),
                "Client Rate": Number(req.body.talentRate),
                "Agency Fee": [req.body.agencyFee],
                Billing: req.body.rateBasis,
                "Onsite Contact Name": req.body.contactName, //new field
                "Onsite Contact Phone": req.body.contactPhone, //new field
                "UNIFORM": req.body.wardrobe, //new field
                "PARKING": req.body.parking, //new field
                "MAKE-UP & HAIR": req.body.makeup, //new field
                "TRAVEL DESCRIPTION": req.body.travel, //new field
                "Recap Description": req.body.recap, //new field
                "SOCIAL MEDIA": req.body.social, //new field
                "Crawl Breakdown": req.body.additionalLocation, //new field
                Referrals: req.body.referrals, //new field
                "TALENT EXPECTATIONS": req.body.talentExpectations, //new field
                "CANCELLATION DESCRIPTION": req.body.cancellation, //newfield
                "CONTACTS": req.body.contacts,
                "MISCELLANEOUS INSTRUCTIONS": req.body.miscellaneous, //new field
                Client: [req.body.clientAssigned],
                Status: req.body.jobStatus
              },
        }),
      }
    );
    console.log(2);
    const data = await result.json();
    // try{
    // sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "");
    // const msg = {
    //     to: 'erin@micheleandgroup.com', // Change to your recipient
    //     from: 'sender@example.com', // Change to your verified sender
    //     subject: 'This is a simple message',
    //     text: 'which contains some text',
    //     html: '<strong>and some html</strong>',
    // };
    // sgMail.send(msg).then((response) => {
    //     console.log(response[0].statusCode);
    //     console.log(response[0].headers);
    // });
    // } catch(e) {
    //     console.log(e);
    // }
    console.log(data);
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error!" });
  }
}
