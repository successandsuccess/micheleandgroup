const ModelSearchItem = ({name, count} : {name: string, count: number}) => {
    return (
        <div className="flex flex-row justify-between">
            <p>{name}</p>
            <p>({count})</p>
        </div>
    )
};

export default ModelSearchItem