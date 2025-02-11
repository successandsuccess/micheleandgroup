// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import * as sgMail from "@sendgrid/mail";

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
    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "");
    const talents = req.body.talent_ids;
    talents?.map((item: any) => {
      const message = req.body.message.replaceAll("[name]", item.name);
      const msg = {
        to: item.email, //item.email // Change to your recipient
        from: req.body.booker_mail, // Change to your verified sender
        subject: req.body.subject,
        html: `
                <div style="text-align:center; padding-top:50px; padding-bottom: 0px;">
                <img src="https://firebasestorage.googleapis.com/v0/b/dylan-41b3e.appspot.com/o/LOGOS%2FMG%20Logo%202006%20jpg.JPG?alt=media&token=40a36450-f56d-419b-9046-98f65530b97d" alt="Trulli" width="150" >
                </div>
                ${message}
                <br/>
                <p style="text-align: center; background-color: #f5f5f5; padding: 10px 0px;">Copyright 2023 Michele & Group, Inc., All Rights Reserved | State License #TA0000236</p>`,
      };
      // console.log("Name:" + item.name, "Email:" + item.email);
      sgMail.send(msg);
    });

    res.status(200).json({});
  } catch (e) {
    res.status(500).json({ message: "Internal server error!" });
  }
}
