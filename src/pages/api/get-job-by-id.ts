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

  var talent_accepted;
  var talent_pending;
  var talent_declined;
  const result = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID}/${req.body.id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const data = await result.json();
  //Pending invitation
  // console.log(data);
  // console.log(data['Invitation pending'])

  if (data?.fields?.["Available Talent"]) {
    const accepted_id = data.fields["Available Talent"];
    const accepted_filter =
      "filterByFormula=OR(" +
      accepted_id.map((id: string) => `RECORD_ID()='${id}'`).join(", ") +
      ")";
    const accepted_invite = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}?${accepted_filter}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    talent_accepted = await accepted_invite.json();
  }

  if (data?.fields?.["TALENT NOT AVAILABLE"]) {
    const pending_id = data.fields["TALENT NOT AVAILABLE"];
    const pending_filter =
      "filterByFormula=OR(" +
      pending_id.map((id: string) => `RECORD_ID()='${id}'`).join(", ") +
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
    talent_pending = await pending_invite.json();
  }
  if (data?.fields?.["INVITED TALENT"]) {
    const decline_id = data.fields["INVITED TALENT"];
    const decline_filter =
      "filterByFormula=OR(" +
      decline_id.map((id: string) => `RECORD_ID()='${id}'`).join(", ") +
      ")";
    const decline_invite = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}?${decline_filter}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    talent_declined = await decline_invite.json();
  }
  var talent_decline ;
  if (data?.fields?.["DECLINED TALENT"]) {
    const decline_id = data.fields["DECLINED TALENT"];
    const decline_filter =
      "filterByFormula=OR(" +
      decline_id.map((id: string) => `RECORD_ID()='${id}'`).join(", ") +
      ")";
    const decline_invite = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}?${decline_filter}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    talent_decline = await decline_invite.json();
  }
  var talent_booked ;
  if (data?.fields?.["Booked Talent"]) {
    const book_id = data.fields["Booked Talent"];
    const book_filter =
      "filterByFormula=OR(" +
      book_id.map((id: string) => `RECORD_ID()='${id}'`).join(", ") +
      ")";
    const book_invite = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}?${book_filter}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    talent_booked = await book_invite.json();
  }
  var talent_canceled ;
  if (data?.fields?.["CANCELLED TALENT"]) {
    const cancel_id = data.fields["CANCELLED TALENT"];
    const cancel_filter =
      "filterByFormula=OR(" +
      cancel_id.map((id: string) => `RECORD_ID()='${id}'`).join(", ") +
      ")";
    const cancel_invite = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}?${cancel_filter}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    talent_canceled = await cancel_invite.json();
  }
  res
    .status(200)
    .json({ data, unavailable: talent_pending, available: talent_accepted, unaccepted: talent_declined, talent_declined: talent_decline, booked: talent_booked, cancel: talent_canceled });
}
