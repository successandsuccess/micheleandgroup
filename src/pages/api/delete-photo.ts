// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    editTalentAccount,
    editTalentProfile,
    insertLog,
  } from "@/utils/airtable/airtable.service";
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
    try {
      const result = await fetch(
        `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${req.body.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              Pictures: req.body.url
            },
          }),
        }
      );
      console.log(2);
      const data = await result.json();
      console.log(data);
      await insertLog(`<a href="${process.env.NEXT_PUBLIC_SERVER_URI}/dashboard/talents/${req.body.id}" target="_blank">${data.fields["TALENT FULL NAME"]}</a> edited profile.`);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal server error!" });
    }
  }
  