export const Label = ({
  text,
  isRequired,
}: {
  text: string;
  isRequired?: boolean;
}) => {
  return (
    <p className="text-[16px] font-medium">
      {text} {isRequired ? <span className="text-[#ff0000]">*</span> : ""}
    </p>
  );
};
