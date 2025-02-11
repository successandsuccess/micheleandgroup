// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
  console.log(
    `https://api.talkjs.com/v1/tEojaa70/conversations/${req.body.job}_${req.body.talent}_${req.body.client}_${req.body.booker}`
  );
  await fetch(
    `https://api.talkjs.com/v1/tEojaa70/conversations/${req.body.job}_${req.body.talent}_${req.body.client}_${req.body.booker}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer sk_test_mZuCBMDkmBosiHfU7xfmnQbK1IjJGNiX`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        participants: [req.body.talent, req.body.client, req.body.booker],
        subject: req.body.job_name,
        custom: {
          category: "order_inquiry",
        },
      }),
    }
  );
  const result = await fetch(
    `https://api.talkjs.com/v1/tEojaa70/conversations/${req.body.job}_${req.body.talent}_${req.body.client}_${req.body.booker}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer sk_test_mZuCBMDkmBosiHfU7xfmnQbK1IjJGNiX`,
        "content-type": "application/json",
      },
      body: JSON.stringify([
        {
          text: "Thank you for your invitation!",
          sender: req.body.talent,
          type: "UserMessage",
        },
      ]),
    }
  );
  const data = await result.json();
  console.log(data);

  res.status(200).json({});
}
