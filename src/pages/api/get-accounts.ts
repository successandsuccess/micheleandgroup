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
var offset = "";
    var accounts:any = [];
      const accountTable = await fetch(
        `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACCOUNT_LIST_TABLE_ID}${req.body.search ? `/?filterByFormula=SEARCH("${req.body.search.toLowerCase()}",LOWER({Combined W/ Name}))` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
            "content-type": "application/json",
          },
        }
      );
    const accountsData = await accountTable.json();
    accountsData.records.map((item: any) => {
    accounts.push({id: item.id, name: item?.fields?.["Combined W/ Name"]});
    })

  res.status(200).json({ data: accounts });
}
