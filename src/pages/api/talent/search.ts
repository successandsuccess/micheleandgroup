// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getTalent } from "@/utils/airtable/airtable.service";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import {getStateCodeByStateName} from "us-state-codes";

interface SelectOptions {
    filterByFormula?: string
    maxRecords?: number
    pageSize?: number
    offset?: string
    sort?: any[]
    view?: string
    fields?: string[]
  }

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

  let searchArr = [];

  // -----------------------------------------------------------------------
  if (req.body.name.length > 0) {
    searchArr.push(
      `SEARCH("${req.body.name.toLowerCase()}",LOWER({Name}))`
    );
  }

  // -----------------------------------------------------------------------
  if (req.body.majorCity.length > 0) {
    searchArr.push(
      `SEARCH("${req.body.majorCity.toLowerCase()}",LOWER({Major City [STATE LOOKUP]}))`
    );
  }
  // console.log(req.body.city);
  // -----------------------------------------------------------------------
  if (req.body.city.length > 0) {
    searchArr.push(
      `SEARCH("${req.body.city.toLowerCase()}",LOWER({City}))`
    );
  }

  // -----------------------------------------------------------------------
  if (req.body.talentType.length > 0 && req.body.talentType !== 'ALL') {
    searchArr.push(
      `SEARCH("${req.body.talentType.toLowerCase()}",LOWER({TALENT TYPE [internal]}))`
    );
  }

  // -----------------------------------------------------------------------
  if (req.body.language.length > 0 && req.body.language !== 'ALL') {
    searchArr.push(`FIND("${req.body.language}",{Languages})`);
    // searchArr.push(`FIND('${req.body.language.toString()}', {Languages})`);
    console.log(req.body.language.length)
  }
  // searchArr.push(`FIND('Spanish', {Languages})`);

  // -----------------------------------------------------------------------
  if (req.body.ethnicity.length > 0 && req.body.ethnicity !== 'ALL') {
    searchArr.push(
      `LOWER({Ethnicity}) = '${req.body.ethnicity.toLowerCase()}'`
    );
  }

  // -----------------------------------------------------------------------
  if (req.body.gender && req.body.gender !== "ALL") {
    searchArr.push(`{Gender} = '${req.body.gender}'`);
  }

  // -----------------------------------------------------------------------
  if (req.body.hairColor && req.body.hairColor !== "ALL") {
    searchArr.push(`{Hair Color} = '${req.body.hairColor}'`);
  }

  // -----------------------------------------------------------------------
  if (req.body.eyeColor && req.body.eyeColor !== "ALL") {
    searchArr.push(`{Eye Color} = '${req.body.eyeColor}'`);
  }

  if(req.body?.tags?.length) {
    var tagsArr: Array<string> = [];
    req.body.tags?.map((item: any) => {
      tagsArr.push(`FIND("${item}",{TAGS [internal]})`);
    })
    searchArr.push(
      `OR(${tagsArr.join(',')})`
    );
    console.log('correct');
    console.log(tagsArr.join(','))
  }

  console.log('bookings', req.body?.bookings)
  if(req.body?.bookings?.length) {
    var bookingArr: Array<string> = [];
    req.body.bookings?.map((item: any) => {
      bookingArr.push(`FIND("${item}",{Types of Bookings})`);
    })
    searchArr.push(
      `OR(${bookingArr.join(',')})`
    );
    console.log('correct');
    console.log(bookingArr.join(','))
  }

  // -----------------------------------------------------------------------
  if (req.body.fromAge || req.body.toAge) {
    const arr = [];
    if (req.body.fromAge) {
      arr.push(`{AGE} >= VALUE('${req.body.fromAge}')`);
    }
    if (req.body.toAge) {
      arr.push(`{AGE} <= VALUE('${req.body.toAge}')`);
    }

    if (arr.length === 1) {
      searchArr.push(arr[0]);
    } else {
      searchArr.push(`AND(${arr.join(",")})`);
    }
  }

  // -----------------------------------------------------------------------
//   if (
//     (req.query["waist-start"] && req.query["waist-start"] !== "Smallest") ||
//     (req.query["waist-end"] && req.query["waist-end"] !== "Largest")
//   ) {
//     const arr = [];
//     if (req.query["waist-start"] && req.query["waist-start"] !== "Smallest") {
//       arr.push(`VALUE({Waist}) >= VALUE('${req.query["waist-start"]}')`);
//     }
//     if (req.query["waist-end"] && req.query["waist-end"] !== "Largest") {
//       arr.push(`VALUE({Waist}) <= VALUE('${req.query["waist-end"]}')`);
//     }
//     if (arr.length === 1) {
//       searchArr.push(arr[0]);
//     } else {
//       searchArr.push(`AND(${arr.join(",")})`);
//     }
//   }

  // -----------------------------------------------------------------------
//   if (
//     (req.query["hips-start"] && req.query["hips-start"] !== "Smallest") ||
//     (req.query["hips-end"] && req.query["hips-end"] !== "Largest")
//   ) {
//     const arr = [];
//     if (req.query["hips-start"] && req.query["hips-start"] !== "Smallest") {
//       arr.push(`VALUE({Hips}) >= VALUE('${req.query["hips-start"]}')`);
//     }
//     if (req.query["hips-end"] && req.query["hips-end"] !== "Largest") {
//       arr.push(`VALUE({Hips}) <= VALUE('${req.query["hips-end"]}')`);
//     }
//     if (arr.length === 1) {
//       searchArr.push(arr[0]);
//     } else {
//       searchArr.push(`AND(${arr.join(",")})`);
//     }
//   }

  // -----------------------------------------------------------------------
  if (
    (req.body.fromShoeSize &&
      req.body.fromShoeSize !== "1") ||
    (req.body.toShoeSize && req.body.toShoeSize !== "16")
  ) {
    const arr = [];
    if (
      req.body.fromShoeSize &&
      req.body.fromShoeSize !== "1"
    ) {
      arr.push(
        `VALUE({Shoe Size}) >= VALUE('${req.body.fromShoeSize}')`
      );
    }
    if (
      req.body.toShoeSize &&
      req.body.toShoeSize !== "16"
    ) {
      arr.push(`VALUE({Shoe Size}) <= VALUE('${req.body.toShoeSize}')`);
    }
    if (arr.length === 1) {
      searchArr.push(arr[0]);
    } else {
      searchArr.push(`AND(${arr.join(",")})`);
    }
  }
  // -----------------------------------------------------------------------
  if (
    (req.body.fromDressSize && req.body.fromDressSize !== "2") ||
    (req.body.toDressSize && req.body.toDressSize !== "16")
  ) {
    const arr = [];
    if (req.body.fromDressSize && req.body.fromDressSize !== "2") {
      arr.push(`VALUE({Dress Size}) >= VALUE('${req.body.fromDressSize}')`);
    }
    if (req.body.toDressSize && req.body.toDressSize !== "16") {
      arr.push(`VALUE({Dress Size}) <= VALUE('${req.body.toDressSize}')`);
    }
    if (arr.length === 1) {
      searchArr.push(arr[0]);
    } else {
      searchArr.push(`AND(${arr.join(",")})`);
    }
  }

  if(req.body.zip && req.body.distance) {
    const zipCodes = await fetch(`https://www.zipcodeapi.com/rest/${process.env.NEXT_PUBLIC_LOCATION_API_KEY}/radius.json/${req.body.zip}/${req.body.distance}/mile`);
    const zipData = await zipCodes.json();

    var zipArr: Array<string> = [];

    zipData?.['zip_codes']?.map((item: any) => {
      zipArr.push(`{Zip}="${item?.['zip_code']}"`);
    })

    if(zipArr.length > 0)
    searchArr.push(`OR(${zipArr.join(',')})`);
  }
  else if (req.body.zip) {
    searchArr.push(`{Zip}="${req.body.zip}"`)
  }

  if (req.body.state && req.body.state !== "ALL") {
    searchArr.push(
      `FIND("${getStateCodeByStateName(
        req.body.state
      )}",{State})`
    );
  }

  if (req.body.rating?.length) {
    var ratingArr: Array<string> = [];
    req.body.rating?.map((item: any) => {
      ratingArr.push(`{Rating}="${item}"`);
    })
    searchArr.push(
      `OR(${ratingArr.join(',')})`
    );
    console.log('correct');
    console.log(ratingArr.join(','))
  }

  if (req.body.status?.length) {
    var statusArr: Array<string> = [];
    req.body.status?.map((item: any) => {
      statusArr.push(`{STATUS}="${item}"`);
    })
    searchArr.push(
      `OR(${statusArr.join(',')})`
    );
    console.log(statusArr.join(','))
  }

  const selectOptions: SelectOptions = {};
  if (searchArr.length > 0) {
    selectOptions.filterByFormula = `AND(${searchArr.join(",")})`;
  }
  

  // selectOptions.maxRecords = 200
  selectOptions.pageSize = 10;
  if (
    req.body.pageSize &&
    !isNaN(Number(req.body.pageSize))
  ) {
    selectOptions.pageSize = Number(req.body.pageSize);
  }
  // console.log('pagesize',req.body.pageSize);

  selectOptions.fields = [
    "Name",
    "AGE",
    "Email",
    "Cell Phone",
    "Gender",
    "Pictures",
    "City",
    "State",
    'Rating',
    'STATUS'
  ];

//   searchQuery["items-per-page"] = req.query["items-per-page"] || 10;
//   searchQuery.page = req.query.page || 1;

  if (req.body.offset) {
    selectOptions.offset = req.body.offset;
  }
  const talents = await getTalent(selectOptions);
  console.log(talents);
  res.status(200).json(talents);
}
