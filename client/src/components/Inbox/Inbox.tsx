import { Dispatch, useEffect } from 'react';
import Swipe from '../Swipe/Swipe';

export default function Inbox({setCurrentPage}: {setCurrentPage: Dispatch<string>}) {
    useEffect(() => {
        setCurrentPage('inbox')
    }, [])

    return (
        // <div style={{ flexGrow: 1}} className="wallpaperBackground">
        //     {/* <div className='swipe-card' draggable="true" onDrag={handleCardDrag} onTouchMove={handleCardDrag} onDragStart={handleDragStart} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onDragEnd={handleDragEnd} onDragExit={handleDragEnd} onTouchCancel={handleTouchEnd} ref={cardRef}>
        //         {
        //             (!errorMessage && currentBunchOfCards && !noCardsLeft) && (
        //                 cardObjToSwipeCard(currentBunchOfCards[currentCardId], setOpenModal)
        //             )
        //         }
        //     </div> */}
        // </div>
        <></>
    )
}