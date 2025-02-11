// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
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
    if (req.body.gender) {
      let profiledata: any = {
        "TALENT FIRST NAME": req.body.name.split(" ")[0],
        "TALENT LAST NAME": req.body.name.split(" ")[1],
        "Street Address 1": req.body.street1,
        "Street Address 2": req.body.street2,
        City: req.body.city,
        State: req.body.state,
        Zip: req.body.zip,
        AGE: Number(req.body.age),
        Gender: req.body.gender,
        "Hair Color": req.body.hairColor,
        "Eye Color": req.body.eyeColor,
        // languages : req.body.['languages'],
        Languages: req.body.languages,
        Ethnicity: req.body.ethnicity,
        Height: req.body.height,
        Waist: req.body.waist,
        Hips: req.body.hips,
        Bust: req.body.bust,
        "Shoe Size": req.body.shoeSize,
        "Dress Size": req.body.dressSize,
        "Cell Phone": req.body.cellPhone,
      };
      const result = await addTalent(profiledata);
      if (result.status === true)
        res.status(200).json({ status: true, message: result.message });
      else res.status(500).json({ status: false, message: result.message });
    }
    res.status(500).json({ status: false,message: "Internal server error!" });
  }
  