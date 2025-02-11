import { BasicInfoItem } from "./BasicInfoItem";

export const Information = ({
  label,
  data,
  underline,
  flexwrap,
}: {
  label: string;
  data: string;
  underline?: boolean;
  flexwrap?: boolean;
}) => {
  return (
    <div className={`flex flex-row ${flexwrap ? "flex-wrap" : ""}`}>
      <BasicInfoItem text={label} />
      <span className={`${underline ? "underline" : ""}`}>{data}</span>
    </div>
  );
};
