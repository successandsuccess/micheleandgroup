// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    getClients,
  } from "@/utils/airtable/airtable.service";
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

    if (req.body.search)
      searchArr.push(
        `SEARCH("${req.body.search.toLowerCase()}",LOWER({Company}))`
      );
    // if (req.body.city)
    //   searchArr.push(`SEARCH("${req.body.city.toLowerCase()}",LOWER({City}))`);
    // if (req.body.state && req.body.state !== 'ALL')
    //   searchArr.push(
    //     `SEARCH("${req.body.state.toLowerCase()}",LOWER({States}))`
    //   );
    const selectOptions: SelectOptions = {};
    if (searchArr.length > 0) {
      selectOptions.filterByFormula = `AND(${searchArr.join(",")})`;
    }
    selectOptions.pageSize = req.body.items_per_page
      ? Number(req.body.items_per_page)
      : 10;
    selectOptions.fields = [
        "Company",
        "Email",
        "Booker",
        "Address",
        "Contact 2 Address",
        "Contact",
        "Phone",
        "Contact 2",
        "Contact 2 Phone",
    ];
    console.log("offset", req.body.offset);
    if (req.body.offset) selectOptions.offset = req.body.offset;
    const jobs = await getClients(selectOptions);
    res.status(200).json(jobs);
  }
  