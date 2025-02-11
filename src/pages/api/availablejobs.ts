// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getBookedJobs } from "@/utils/airtable/airtable.service";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { getStateCodeByStateName } from "us-state-codes";

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
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  let searchArr: any = [];
  if (req.body.type === "talent") {
    // const result = await fetch(
    //   `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ACTIVE_TALENT_TABLE_ID}/${req.body.id}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
    //       "content-type": "application/json",
    //     },
    //   }
    // );
    // const talent_name = await result.json();
    // console.log(talent_name.fields["TALENT FULL NAME"]);
    searchArr.push("{Public for Talent}=1");
    searchArr.push(`IS_AFTER({Start Date/Time}, NOW())`);
    searchArr.push(
      `OR({Status}='Need to Book',{Status} = 'Invite Talent',{Status} = 'Add info to Booking',{Status} = 'Add to Website',{Status} = 'Final Reminder to Confirm')`
    );
    if (req.body.fromDate) {
      searchArr.push(`IS_AFTER({Start Date/Time}, '${req.body.fromDate}')`);
    }

    if (req.body.toDate) {
      searchArr.push(`IS_BEFORE({End Date/Time}, '${req.body.toDate}')`);
    }

    if (req.body.eventType && req.body.eventType !== "ALL") {
      console.log("Hello");
      searchArr.push(`{Type of Event} = "${req.body.eventType}"`);
    }

    if (req.body.search_booker_name && req.body.search_booker_name !== "ALL") {
      console.log("Hello");
      searchArr.push(`{Bookers} = "${req.body.search_booker_name}"`);
    }
    // searchArr = [
    //   `FIND("${talent_name.fields["TALENT FULL NAME"]}",{Available Talent})`,
    // ];
    // searchArr = [`SEARCH("${req.body.id.toLowerCase()}",LOWER({Invitation accepted}))`];
  } else if (req.body.type === "booker") {
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
  } else if (req.body.type === "client") {
    const result = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_CLIENTS_TABLE_ID}/${req.body.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const booker_name = await result.json();
    searchArr = [`{Client} = '${booker_name.fields.Company}'`];

    //
  }

  if (req.body.search && req.body.search.length)
    searchArr.push(
      `SEARCH("${req.body.search.toLowerCase()}",LOWER({JOB TITLE}))`
    );
  if (req.body.city && req.body.city.length) {
    searchArr.push(
      `FIND("${req.body.city}",{Account City})`
    );
    console.log(req.body.city);
  }
  if (req.body.state && req.body.state !== "ALL") {
    searchArr.push(
      `FIND("${getStateCodeByStateName(req.body.state)}",{State})`
    );
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
    "Event",
    "EVENT DESCRIPTION",
    "Available Talent",
    "Booked Talent",
    "Account City",
    "State",
    "Status for Talent View",
    "Company (from Client)",
  ];
  if (req.body.offset) selectOptions.offset = req.body.offset;
  const jobs = await getBookedJobs(selectOptions, "START DATE");
  res.status(200).json(jobs);
}
