export const Card = ({src, description} : {src: string, description: string}) => {
    return(
        <div className="relative mx-2 h-full">
             <img src={src} className="w-full  h-full object-cover" alt={description}/>
            <p className="absolute bottom-0 left-0 w-full p-[18px] text-[24px] text-primary bg-[#212121BF] font-bold">{description}</p>
        </div>
    )
}