const Paragraph = ({description, bold}: {description: string, bold?: boolean}) => {
    return(
        <p className="mb-[40px] text-[18px] font-medium max-md:text-[16px] max-md:mb-[30px]" style={bold? {fontWeight: 700} :{}}>{description}</p>
    )
}

export default Paragraph