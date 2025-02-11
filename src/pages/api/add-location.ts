// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import {getStateCodeByStateName} from "us-state-codes";

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
  console.log((req.body.state))
  try {
    const result = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACCOUNT_LIST_TABLE_ID}`,
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
                "Store Name": req.body.storeName,
                "Address": req.body.address,
                "City" : req.body.city,
                "State": getStateCodeByStateName(req.body.state),
                "Zip" : req.body.zip,
                "Phone": req.body.phone,
                "On or Off Premise": req.body.premise
              },
            },
          ],
        }),
      }
    );
    const data = await result.json();
    console.log(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ message: "Internal server error!" });
  }
}
