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
      const talent_record = await fetch(
        `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}?filterByFormula=NOT({Pictures to Approve} = '')`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
            "content-type": "application/json",
          },
        }
      );
  
      const talent_data = await talent_record.json();
  
      res.status(200).json({ data: talent_data });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal server error!" });
    }
  }
  