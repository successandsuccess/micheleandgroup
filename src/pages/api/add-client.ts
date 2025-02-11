// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    addClient,
    addTalent,
    editTalentAccount,
    editTalentProfile,
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
    if (req.body.name) {
      let profiledata: any = {
        "Company": req.body.name,
        "Email": req.body.email,
        "Booker": [req.body.booker],
        "Address": req.body.street1,
        "Contact 2 Address": req.body.street2,
        "Contact": req.body.contactName1,
        "Phone" : req.body.contactPhone1,
        "Contact 2" : req.body.contactName2,
        "Contact 2 Phone" : req.body.contactPhone2,
      };
      const result = await addClient(profiledata);
      if (result.status === true)
        res.status(200).json({ status: true, message: result.message });
      else res.status(500).json({ status: false, message: result.message });
    }
    res.status(500).json({ status: false,message: "Internal server error!" });
  }
  