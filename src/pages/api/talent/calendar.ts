// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getTalentBookedBookings } from "@/utils/airtable/airtable.service";
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
  const data = await getTalentBookedBookings({
    talentId: req.body.id,
    
    fields: [
      "Start Date/Time",
      "End Date/Time",
      "JOB TITLE",
      "Job Link",
      "Day 2 Start",
      "Day 2 End",
      "Day 3 Start",
      "Day 3 End",
      "Day 4 Start",
      "Day 4 End",
      "Day 5 Start",
      "Day 5 End",
      "Day 6 Start",
      "Day 6 End",
      "Day 7 Start",
      "Day 7 End",
      "Day 8 Start",
      "Day 8 End",
      "Day 9 Start",
      "Day 9 End",
      "Day 10 Start",
      "Day 10 End",
      "Day 11 Start",
      "Day 11 End",
      "ConfirmBooking"
    ],
  });
  if(data)
  res.status(200).json(data);
else res.status(200).json([]);
}
