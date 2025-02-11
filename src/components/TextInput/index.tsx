const TextInput = ({
  id,
  name,
  type,
  required,
  label,
  value,
  setValue,
}: {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  label: string;
  value: string;
  setValue: any;
}) => {
  return (
    <div>
      <label>{label}</label>
      <br />
      <input
        className="py-[6px] px-[12px] h-[38px] outline-primary w-full border-[1px] border-gray-200"
        type={type}
        id={id}
        name={name}
        required={required ? true : false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default TextInput;
