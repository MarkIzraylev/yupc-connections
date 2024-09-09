import {useState, useEffect} from 'react';
import axios from 'axios';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';

export function useSelectWithFetchedOptions(label, fetchingArrName, required) {
    let [data, setData] = useState([]); // options which are objects with keys 'id' and 'name'
    const [selectedOptionId, setSelectedOptionId] = useState('');

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function onChange(ev) {
        setSelectedOptionId(ev.target.value)
    }

    useEffect(() => {
        axios.get(`/api/get${capitalizeFirstLetter(fetchingArrName)}/`)
        .then(response => {
            if (response.status != 200) return
            setData(response.data[fetchingArrName])
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    return {
        label: label,
        value: selectedOptionId,
        onChange: onChange,
        data: data,
        required: required
    }
}

export function ReactiveSelect({label, value, onChange, data, required, validate}) {
    return (
        <FormControl fullWidth style={{marginBottom: 8}} required={required} error={validate && value === '' && required}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                label={label}
                onChange={onChange}
                children={data.map(dataObj => {
                    return <MenuItem value={dataObj.id}>{dataObj.name}</MenuItem>
                })}
            />
        </FormControl>
    )
}