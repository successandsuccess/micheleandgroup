const ImageInput = ({placeholder, img} : {placeholder : string, img: string}) => {
    return(
        <div className="relative">
            <input type="text" placeholder={placeholder} className="w-full border-[1px] text-[16px] p-4 rounded-xl outline-primary"></input>
            <img src={img} className="absolute right-[15px] top-[50%] translate-y-[-50%]"/>
        </div>
    )
}

export default ImageInput;