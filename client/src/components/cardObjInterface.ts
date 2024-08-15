interface cardObj {
    id: number;
    first_name: string;
    last_name: string;
    sur_name: string;
    image: string;
    description: string;
    is_search_friend: boolean;
    is_search_love: boolean;
    hobbies: string[];
    course_name: string;
    building_name: string;
    department_name: string;
    tg_contact: undefined | string;
    vk_contact: undefined | string;
}
export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 350,
    width: '90vw',
    maxWidth: 600,
    maxHeight: '60vh',
    overflowY: 'auto',
    outline: 'none',
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    p: 4,
};
export type {cardObj}