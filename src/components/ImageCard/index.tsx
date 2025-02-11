const ImageCard = ({src}:{src: string}) => {
    return(
        <div className="secondary-shadow hover:shaodw-[0px_10px_15px_-3px_rgba(231,181,50,0.2)] max-sm:h-[180px] hover:border-primary transition-all bg-white border-gray-200 border-[1px] rounded-xl flex flex-col justify-center items-center px-[50px] py-[20px] ">
            <img src={src} className="max-w-[300px] max-h-[200px] align-middle max-xl:max-w-[225px] max-xl:max-h-[150px] max-md:max-w-[170px] max-md:max-h-[150px] max-sm:max-w-[225px] max-sm:max-h-[150px]"/>
        </div>
    )
}

export default ImageCard;