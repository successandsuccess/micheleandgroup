import { GetAccountInformation } from "@/actions/getAccountInformation";
import { GetJobs } from "@/actions/getJobs";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Select, SelectItem } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SearchIcon } from "../../../components/SearchIcon";
import { Pagination } from "@/components/Pagination";
import { useRouter } from "next/router";

export default function Jobs() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const [jobs, setJobs] = useState<any>();
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [offsetArr, setOffsetArr] = useState([""]);
  const [pageSize, setPageSize] = useState(new Set<string>([`10`]));

  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (airtable_id && pageSize) {
        setDataLoading(true);
        //   const result = await GetCalendarList(airtable_id, accountType);
        //   console.log(result);
        //   setEvents(result.data)

        // const result = await GetJobs(airtable_id, accountType, Array.from(pageSize).toString(), search);
        setPageIndex(0);
        // setOffsetArr(["",result.data.offset]);
        //   setJobs(result.data.records);
        //   console.log(result);
        setDataLoading(false);
      }
    })();
  }, [airtable_id, pageSize]);

  const handlePagenation = async (index: any) => {
    console.log(index);
    if (index < 0) return;
    if (pageIndex === index) return;
    setDataLoading(true);

    console.log(offsetArr);
    console.log(offsetArr[index]);
    // const result = await GetJobs(airtable_id, accountType, Array.from(pageSize).toString(), search, offsetArr[index]);
    setPageIndex(index);
    // if(offsetArr.length === index + 1)
    //   setOffsetArr([...offsetArr, result.data.offset]);

    // console.log(result.data);
    // const temp = offsetArr;
    // temp.push(result.data.records);
    // setOffsetArr(temp);
    // setJobs(result.data.records);
    setDataLoading(false);
  };

  const handleSearch = async () => {
    setDataLoading(true);
    // const result = await GetJobs(airtable_id, accountType, Array.from(pageSize).toString(), search);
    // setJobs(result.data.records);
    // setPageIndex(0);
    // setOffsetArr(["",result.data.offset]);
    setDataLoading(false);
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Available Jobs
        </p>
        <div className="rounded-2xl lg:p-[30px] flex flex-col gap-5 w-full md:p-[20px] p-[15px] bg-white shadow-md">
          {/* <p className="text-[18px] font-bold">Account Login</p> */}
          <Input
            label="Search"
            isClearable
            radius="lg"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            onClear={() => setSearch("")}
            placeholder="Type Event Name to search..."
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") await handleSearch();
            }}
          />
          <div className="rounded-md overflow-hidden border-[1px]">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-primary l">
                  <th className="p-5">#ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Event Name</th>
                  {/* <th>Event Status</th> */}
                </tr>
              </thead>
              <tbody>
                {jobs ? (
                  jobs.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b-[1px] hover:bg-gray-100 bg-white cursor-pointer"
                      onClick={() => router.push(`/job-board/${item.id}`)}
                    >
                      <td className="p-5">#{item.fields["ID"]}</td>
                      <td>{item.fields["START DATE"]}</td>
                      <td>
                        {new Date(
                          item.fields["Start Date/Time"]
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) +
                          " - " +
                          new Date(
                            item.fields["End Date/Time"]
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </td>
                      <td>{item.fields["JOB TITLE"]}</td>
                      {/* <td>#12960</td> */}
                    </tr>
                  ))
                ) : (
                  <tr></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-row justify-between mt-[30px]">
            <div className="w-[100px]">
              <Select
                variant="bordered"
                selectedKeys={pageSize}
                size="sm"
                onSelectionChange={setPageSize as any}
              >
                <SelectItem key={10} value="10">
                  10
                </SelectItem>
                <SelectItem key={20} value="20">
                  20
                </SelectItem>
                <SelectItem key={50} value="50">
                  50
                </SelectItem>
                <SelectItem key={100} value="100">
                  100
                </SelectItem>
              </Select>
            </div>
            <Pagination
              offsetArr={offsetArr}
              handleClick={handlePagenation}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
