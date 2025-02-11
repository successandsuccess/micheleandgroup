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
    // const talent_record = await fetch(
    //   `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${req.body.id}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
    //       "content-type": "application/json",
    //     },
    //   }
    // );

    // const talent_data = await talent_record.json();

    // const real_talent_record = await fetch(
    //   `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_TALENT_TABLE_ID}?filterByFormula=AND({Email} = '${talent_data.fields?.['Email']}')`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // const real_talent_data = await real_talent_record.json();
    // const talent_id = real_talent_data.records[0].id;

    // const urls: Array<any> = [];
    // real_talent_data.records[0].fields?.["Images to Approve"]?.map((item: any) => urls.push({ url : item.url}));

    // urls.push({url: req.body.url});

    // const result = await fetch(
    //   `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_TALENT_TABLE_ID}/${talent_id}`,
    //   {
    //     method: "PATCH",
    //     headers: {
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
    //       "content-type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       fields: {
    //         "Images to Approve": urls
    //       },
    //     }),
    //   }
    // );
    // console.log(2);
    // const data = await result.json();
    // console.log(data);


    const talent_record = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${req.body.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );

    const talent_data = await talent_record.json();

    var urls = talent_data.fields?.["Pictures to Approve"] || '';
  
    urls += `${req.body.url},`;

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
            "Pictures to Approve": urls
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
