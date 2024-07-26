import { Dispatch, useEffect } from 'react';

export default function Inbox({setCurrentPage}: {setCurrentPage: Dispatch<string>}) {
    useEffect(() => {
        setCurrentPage('inbox')
    }, [])

    return (
        <div style={{ flexGrow: 1}}>hello inbox</div>
    )
}