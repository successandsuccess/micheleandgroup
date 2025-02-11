import { GetActivities } from "@/actions/getActivities";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Pagination } from "@/components/Pagination";
import { SearchIcon } from "@/components/SearchIcon";
import { useSearchParams } from "next/navigation";

export default function Home() {

  const searchParams = useSearchParams();
  const query = searchParams.get("search");
  const { accountType, setDataLoading } = useParticipantStore((state) => state);
  const [logs, setLogs] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [offsetArr, setOffsetArr] = useState([""]);
  const [pageSize, setPageSize] = useState(new Set<string>([`10`]));
  const [search, setSearch] = useState(query ? query.toString() : '');
  

  const handlePagenation = async (index: any) => {
    console.log(index);
    if (index < 0) return;
    if (pageIndex === index) return;
    setDataLoading(true);

    console.log(offsetArr);
    console.log(offsetArr[index]);
console.log(offsetArr[index]);

    const result = await GetActivities(Array.from(pageSize).toString(), query ? query.toString() :search, offsetArr[index]);
    setPageIndex(index);
    if (offsetArr.length === index + 1)
      setOffsetArr([...offsetArr, result.data.data.offset]);

    setLogs(result.data.data.records);

    setDataLoading(false);
  };

  useEffect(() => {
    (async () => {
        setDataLoading(true);
        console.log(query);
        const result = await GetActivities(Array.from(pageSize).toString(), query ? query.toString() : search );
        console.log(result);
        setLogs(result.data.data.records);
        setPageIndex(0);
        setOffsetArr(["", result.data.data.offset]);
        setDataLoading(false);
    })();
  }, [pageSize, query]);

  const handleSearch = async () => {
    setDataLoading(true);
        const result = await GetActivities(Array.from(pageSize).toString(), search);
        console.log(result);
        setLogs(result.data.data.records);
        setPageIndex(0);
        setOffsetArr(["", result.data.data.offset]);
        setDataLoading(false);

  }
  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Activities
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
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
            className={`${query ? 'hidden' : ''}`}
            onClear={() => setSearch("")}
            placeholder="Type to search..."
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") await handleSearch();
            }}
          />
          <br/>
            <table className="w-full">
              <thead className="bg-primary">
                <tr>
                  <th>No</th>
                  <th>Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {logs?.map((item : any, index: number) => 
                  <tr key={index} className="bg-[#e7b53211]">
                    <td>{index + 1 + Number(Array.from(pageSize).toString()) * pageIndex}</td>
                    {/* <td>{item.fields?.['Last Modified Time']?.split('T')[0]}</td> */}
                    <td>{new Date(item.fields?.['Last Modified Time']).toLocaleString()}</td>
                    <td>{parse(item.fields.Log)}</td>
                  </tr>
                )}
              </tbody>
            </table>
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
      </div>
    </main>
  );
}
