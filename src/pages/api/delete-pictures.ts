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
      console.log(req.body.id);
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
                "Pictures to Approve": req.body.url
              },
            }),
          }
        );
  
      const talent_data = await result.json();
      console.log(talent_data);
      res.status(200).json({ data: talent_data });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal server error!" });
    }
  }
  