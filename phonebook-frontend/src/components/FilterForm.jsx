const FilterForm = ({findings, handleFindingChange}) => {
    return (
        <div>
            filter shown with
            <input
                value={findings}
                onChange={handleFindingChange}
            />
        </div>
    )
}

export default FilterForm