const TalentCard = ({ image, name }: { image: string, name: string }) => {
    return (
        <div className="p-5 rounded-xl border-[1px]">
            <div className="relative">
                <img src={image} className="" />
                <div className="transition ease-in duration-300 opacity-0 absolute w-full h-full bg-[#00000077] top-0 left-0 z-10 ">
                    {/* <div className="">
                        <div className="flex align-middle flex-col justify-center gap-5 p-5">
                            <div className="flex flex-row justify-between">
                                <p className="text-primary">Height</p>
                                <p className="text-white">189cm</p>
                            </div>
                            <hr />
                            <div className="flex flex-row justify-between">
                                <p className="text-primary">Weight</p>
                                <p className="text-white">56kg</p>
                            </div>
                            <hr />
                            <div className="flex flex-row justify-between">
                                <p className="text-primary">Bust</p>
                                <p className="text-white">88cm</p>
                            </div>
                            <hr />
                            <div className="flex flex-row justify-between">
                                <p className="text-primary">Weist</p>
                                <p className="text-white">64cm</p>
                            </div>
                            <hr />
                            <div className="flex flex-row justify-between">
                                <p className="text-primary">Hips</p>
                                <p className="text-white">91cm</p>
                            </div>
                            <hr />
                        </div>
                    </div> */}
                </div>
            </div>
            {/* <p className="font-bold mt-5">{name}</p> */}

        </div>
    )
}

export default TalentCard;