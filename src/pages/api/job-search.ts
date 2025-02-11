// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  getBookedJobs,
} from "@/utils/airtable/airtable.service";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

interface SelectOptions {
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;
  offset?: string;
  sort?: any[];
  view?: string;
  fields?: string[];
}

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

  let searchArr: any = [];

  const result = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_STAFF_TABLE_ID}/${req.body.id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        "content-type": "application/json",
      },
    }
  );
  const booker_name = await result.json();
  searchArr = [`{Booker_name} = '${booker_name.fields.Name}'`];

  if (req.body.title)
    searchArr.push(
      `SEARCH("${req.body.title.toLowerCase()}",LOWER({JOB TITLE}))`
    );

  if(req.body.fromDate) {
    searchArr.push(`IS_AFTER({Start Date/Time}, '${req.body.fromDate}')`)
  }

  if(req.body.toDate) {
    searchArr.push(`IS_BEFORE({End Date/Time}, '${req.body.toDate}')`)
  }
  if(req.body.client) {
    console.log(req.body.client)
    searchArr.push(`{Company (from Client)}="${req.body.client}"`)
  }
  if(req.body.status) {
    console.log(req.body.client)
    searchArr.push(`{Status}="${req.body.status}"`)
  }
  
  const selectOptions: SelectOptions = {};
  if (searchArr.length > 0) {
    selectOptions.filterByFormula = `AND(${searchArr.join(",")})`;
  }
  selectOptions.pageSize = req.body.items_per_page
    ? Number(req.body.items_per_page)
    : 10;
  selectOptions.fields = [
    "ID",
    "START DATE",
    "Start Date/Time",
    "End Date/Time",
    "JOB TITLE",
    "EVENT DESCRIPTION",
    "Status for Talent View",
    "Company (from Client)"
  ];
  if (req.body.offset) selectOptions.offset = req.body.offset;
  const jobs = await getBookedJobs(selectOptions, "START DATE");
  res.status(200).json(jobs);
}
