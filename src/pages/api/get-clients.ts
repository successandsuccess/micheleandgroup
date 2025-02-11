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
  if (req.body.type === "booker") {
    const result = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_STAFF_TABLE_ID}/${req.body.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const data = await result.json();
    var offset = "";
    var clients:any = [];
    do {
      const clientTable = await fetch(
        `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_MG_BASE_CLIENTS_TABLE_ID}?fields[]=Client%20Name&fields[]=Company${offset? '&offset='+offset : ''}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
            "content-type": "application/json",
          },
        }
      );
      const clientsData = await clientTable.json();
      offset = clientsData.offset;
      clientsData.records.map((item: any) => {
        clients.push({id: item.id, clientName: item?.fields?.['Client Name'] || '', company: item?.fields?.Company});
      })
    } while (offset);
    const assignedClients = clients?.filter((item: any) =>
      data?.fields?.Clients?.includes(item.id)
    );
    res.status(200).json({ data: assignedClients });
  }
}
