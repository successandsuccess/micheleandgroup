// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { editBookerAccount, editTalentAccount } from "@/utils/airtable/airtable.service";
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
  if (req.body.firstName?.toString()) {
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const cellPhone = req.body.cellPhone;
    const emailSignature = "";
    if (req.body.type === "talent") {
      const result = await editTalentAccount(
        req.body.id,
        password?.toString(),
        firstName.toString(),
        lastName.toString(),
        email?.toString(),
        cellPhone.toString(),
        emailSignature?.toString(),
        req.body.previousEmail
      );
      console.log(result);
      if (result.status === true)
        res.status(200).json({ message: result.message });
      else res.status(500).json({ message: result.message });
      return;
    }
    if (req.body.type === "booker") {
      const result = await editBookerAccount(
        req.body.id,
        password?.toString(),
        firstName.toString(),
        lastName.toString(),
        email.toString(),
        cellPhone.toString(),
        emailSignature?.toString(),
        req.body.previousEmail
      );
      console.log(result);
      if (result.status === true)
        res.status(200).json({ message: result.message });
      else res.status(500).json({ message: result.message });
      return;
    }
    res.status(500).json({ message: "Internal server error!" });
  }
  // if (req.user.type === 'booker')
  //   result = await airtableService.editBookerAccount(
  //     req.user.airtable_id,
  //     password?.toString(),
  //     firstName.toString(),
  //     lastName.toString(),
  //     email.toString(),
  //     cellPhone.toString(),
  //     emailSignature?.toString(),
  //     req.user.email
  //   )
  // res.redirect('/dashboard');
}
