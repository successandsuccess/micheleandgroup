// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getJobsOfBooker } from "@/utils/airtable/airtable.service";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Booker");
  console.log(`Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`);
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const data = await getJobsOfBooker(req.body.id, [
    'Start Date/Time',
    'End Date/Time',
    'JOB TITLE',
    'Job Link',
  ]);
  res.status(200).json(data);
}
