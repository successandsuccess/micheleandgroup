// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
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
    console.log("This is gender");
    console.log(req.body.gender);
    var profiledata: any = {
      "TALENT FIRST NAME": req.body.name.split(" ")[0],
      "TALENT LAST NAME": req.body.name.split(" ")[1],
      "TALENT MIDDLE": req.body.middleName || '',
      "SUFFIX" : req.body.suffix || '',
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
      "Shoe Size": req.body.shoeSize,
      "Cell Phone": req.body.cellPhone,
      "DBA" : req.body.dba || '',
      "Min Hourly Rate" : req.body.minHourly,
      "Min Daily Rate" : req.body.minDaily,
      "Instagram" : req.body.instagram,
      "Casting Networks Link" : req.body.castingNetworks,
      "Special Skills" : req.body.skills
    };

    if(req.body.gender === 'Male') {
      profiledata['Inseam'] = req.body.inseam;
      profiledata['Suit'] = req.body.Suit;
    }
    else {
      profiledata['Hips'] = req.body.hips;
      profiledata['Bust'] = req.body.bust;
      profiledata["Dress Size"] = req.body.dressSize;
     }

    console.log(req.body.certification);

    if(req.body?.certification?.length) {
      profiledata['Type of Permit'] = req.body.certification;
    }

    if(req.body?.certificationDate) {
      profiledata['Permit Expiration Date'] = req.body.certificationDate;
    }

    const talent_record = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_TALENT_BASE_TALENT_TABLE_ID}?filterByFormula=AND({Email} = '${req.body.previousEmail}')`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const talent_data = await talent_record.json();
    const talent_id = talent_data.records[0].id;
    if (
      req.body.street1 !==
        talent_data.records[0]?.fields?.["Street Address 1"] ||
      req.body.street2 !==
        talent_data.records[0]?.fields?.["Street Address 2"] ||
      req.body.city !== talent_data.records[0]?.fields?.["City"] ||
      req.body.state !== talent_data.records[0]?.fields?.["State"] ||
      req.body.zip !== talent_data.records[0]?.fields?.["Zip"]
    )
      profiledata['ADDRESS UPDATED'] = true;
    // const talent_id = req.body.id;

    if (req.body.email && req.body.email !== req.body.previousEmail)
      profiledata["Email"] = req.body.email;
    const result = await editTalentProfile(talent_id, profiledata);
    console.log(result);
    if (result.status === true)
      res.status(200).json({ status: true, message: result.message });
    else res.status(500).json({ status: false, message: result.message });
  }
  res.status(500).json({ status: false, message: "Internal server error!" });
}
