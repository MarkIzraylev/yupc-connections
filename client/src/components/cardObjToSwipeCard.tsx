import SwipeCard from "./SwipeCard/SwipeCard"

import { cardObj } from './cardObjInterface';

export function cardObjToSwipeCard(card: cardObj, setOpenModal: any, showSocialMediaLinks: boolean | undefined = false, isOwnProfile: boolean | undefined = false) {
    const intentionTagsArr = []
    if (card.is_search_friend) {
        intentionTagsArr.push('ИЩУ ДРУЖБУ')
    }
    if (card.is_search_love) {
        intentionTagsArr.push('ИЩУ ЛЮБОВЬ')
    }
    const socialMedia = new Map()
    if (showSocialMediaLinks) {
        if (card.tg_contact) {
            socialMedia.set('tg', card.tg_contact)
        }
        if (card.vk_contact) {
            socialMedia.set('vk', card.vk_contact)
        }
    }
    // console.log('-> social media map: ', socialMedia)
    return (
        <SwipeCard
            name={`${card.first_name} ${card.last_name}`}
            mainTags={[card.course_name, card.building_name, card.department_name]}
            hobbiesTags={card.hobbies}
            intentionTags={intentionTagsArr}
            description={card.description}
            imageSrc={card.image ? `http://127.0.0.1:8000/${card.image}` : 'https://i.pinimg.com/736x/c6/c3/0d/c6c30d611b4cdef5a4d73a54c3e0055b.jpg'}
            setOpenModal={setOpenModal}
            socialMedia={socialMedia}
            isOwnProfile={isOwnProfile}
        />
    )
}