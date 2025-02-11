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
  console.log(`https://api.talkjs.com/v1/tEojaa70/users/${req.body.id}`);
  await fetch(
    `https://api.talkjs.com/v1/tEojaa70/users/${req.body.id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer sk_test_mZuCBMDkmBosiHfU7xfmnQbK1IjJGNiX`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
          name: req.body.name,
          email: [req.body.email],
          // photoUrl:
          // welcomeMessage:
          role: req.body.type
      })
    }
  );
    
    res.status(200).json({  });
}
