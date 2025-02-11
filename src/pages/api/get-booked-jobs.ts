// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getBookedJobs } from "@/utils/airtable/airtable.service";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

interface SelectOptions {
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;
  offset?: string;
  view?: string;
  fields?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Testing");
  console.log(
    `tester ${process.env.NEXT_BPULIC_AIRTABLE_MG_BASE_BOOKINGS_TABLE_ID || ""}`
  );
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  let searchArr: any = [];
  if (req.body.type === "talent") {
    const result = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${req.body.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const talent_name = await result.json();
    console.log(talent_name.fields["TALENT FULL NAME"]);
    searchArr = [
      `FIND("${talent_name.fields["TALENT FULL NAME"]}",{Booked Talent})`,
    ];
    // searchArr = [`SEARCH("${req.body.id.toLowerCase()}",LOWER({Invitation accepted}))`];
  }
  // else if (req.body.type === "booker"){
  //   const result = await fetch(
  //     `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_STAFF_TABLE_ID}/${req.body.id}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
  //         "content-type": "application/json",
  //       },
  //     }
  //   );
  //   const booker_name = await result.json();
  //   searchArr = [`{Booker_name} = '${booker_name.fields.Name}'`];
  // }
  // else if (req.body.type === 'client') {
  //   const result = await fetch(
  //     `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_CLIENTS_TABLE_ID}/${req.body.id}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
  //         "content-type": "application/json",
  //       },
  //     }
  //   );
  //   const booker_name = await result.json();
  //   searchArr = [`{Client} = '${booker_name.fields.Company}'`];
  // }
  
  switch (req.body.option) {
    case "ALL":
      break;
    case "UPCOMING BOOKED JOBS":
      searchArr.push(`IS_AFTER({Start Date/Time}, NOW())`);
      break;
    case "PAST COMPLETED JOBS":
      searchArr.push(`IS_BEFORE({End Date/Time}, NOW())`);
      // searchArr.push(`{ConfirmBooking}=1`)
      break;
    default:
      if (req.body.option)
        searchArr.push(
          `DATETIME_FORMAT({Start Date/Time}, 'YYYY-MM-DD')='${req.body.option}'`
        );
      break;
  }

  if (req.body.search)
    searchArr.push(
      `SEARCH("${req.body.search.toLowerCase()}",LOWER({JOB TITLE}))`
    );
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
    "Available Talent",
    "Booked Talent",
    "Status for Talent View",
  ];
  console.log("offset", req.body.offset);
  if (req.body.offset) selectOptions.offset = req.body.offset;
  const jobs = await getBookedJobs(selectOptions, "START DATE");
  res.status(200).json(jobs);
}
