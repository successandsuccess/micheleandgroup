// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isUserExist } from '@/lib/firebaseadmin'
import { getUserFromAirtble } from '@/utils/airtable/getUserFromAirtble'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await getUserFromAirtble(req.body.email, req.body.password);
  console.log(result);
  if(result?.status === false){
    res.status(500).json({ name: 'email and password is incorrect' });
    return;
  }
  
  const isExist = await isUserExist(req.body.email, req.body.password, result?.user?.airtable_id, result?.user?.type, result?.user?.username);
  console.log(4);
  if(isExist){
    console.log(5);
    res.status(200).json({ message: 'email and password is correct' });
    return;
  }
  else{
    console.log(6)
    res.status(500).json({ name: 'email and password is incorrect' });
  }
}
