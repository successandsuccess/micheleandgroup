type HorizontalLineProps = {
    active: boolean
  }
  
  export const HorizontalLine = ({ active }: HorizontalLineProps) => {
    return (
      <div
        className={`w-full h-[4px] rounded my-auto ${
          active
            ? "bg-gradient-to-r from-sky-400 via-30% to-emerald-400 to-90%"
            : "bg-sky-300 opacity-25"
        } `}
      ></div>
    )
  }
  