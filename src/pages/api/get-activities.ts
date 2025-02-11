// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getStaffData } from "@/utils/airtable/airtable.service";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("hello");
  console.log(`Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`);
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  try {
    const result = await fetch(
      `https://api.airtable.com/v0/${
        process.env.NEXT_PUBLIC_SUPPORT_BASE_ID
      }/${
        process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_LOG_TABLE_ID
      }?${
        req.body.search
          ? '&filterByFormula=SEARCH("' +
            req.body.search.toLowerCase() +
            '",LOWER({Log}))&'
          : ""
      }sort[0][field]=Last Modified Time&sort[0][direction]=desc&pageSize=${
        req.body.items_per_page ? Number(req.body.items_per_page) : 10
      }${req.body.offset ? "&offset=" + req.body.offset : ""}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    console.log(`https://api.airtable.com/v0/${
      process.env.NEXT_PUBLIC_SUPPORT_BASE_ID
    }/${
      process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_LOG_TABLE_ID
    }sort[0][field]=Last Modified Time${
      req.body.search
        ? '&filterByFormula=SEARCH("' +
          req.body.search.toLowerCase() +
          ",LOWER({Log}))"
        : ""
    }&sort[0][direction]=desc&pageSize=${
      req.body.items_per_page ? Number(req.body.items_per_page) : 10
    }${req.body.offset ? "&offset=" + req.body.offset : ""}`)
    const data = await result.json();

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ data: error });
    console.log(error);
    return [];
  }
}
