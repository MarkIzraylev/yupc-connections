import { Dispatch, useEffect } from 'react';

export default function Match({setCurrentPage}: {setCurrentPage: Dispatch<string>}) {
    useEffect(() => {
        setCurrentPage('match')
    }, [])

    return (
        <div style={{ flexGrow: 1}}>
            Match
        </div>
    )
}