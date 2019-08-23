import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import '../styles/map.css';

let SidebarRoutesItem = (props) => {
    const { id, content, index } = props;

    return (
        <Draggable draggableId={id} index={index}>
            {provided => (
                <li
                    className='map-sidebar__list__item'
                    data-index={index}
                    data-id={id}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <span>{content}</span>
                    <span className='close-item'>[x]</span>
                </li>
            )}
        </Draggable>
    )
}

SidebarRoutesItem = React.memo(SidebarRoutesItem);

export default SidebarRoutesItem;