import React, { useMemo } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import '../styles/map.css';
import SidebarRoutesItem from './SidebarRoutesItem.js';


let SidebarRoutes = (props) => {
    const { routes, handleInput, handleSidebarItemDelete, handleSidebarItemDrag } = props;

    const column = routes.columns['column-1'];

    const draggableItem = column.pointsIds.map((id, index) => {
        const point = routes.points[id];
        return <SidebarRoutesItem id={point.id} content={point.content} index={index} key={point.id} />
    });

    const droppableList = useMemo(
        () => (
            <DragDropContext onDragEnd={handleSidebarItemDrag}>
                <Droppable droppableId={column.id}>
                    {provided => (
                        <ul
                            className='map-sidebar__list'
                            onClick={handleSidebarItemDelete}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {draggableItem}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        ),
        [draggableItem]
    )

    return (
        <aside className='map-sidebar'>
            <input className='map-sidebar__input' type='text' placeholder='Введите название точки' onKeyDown={handleInput} />
            {droppableList}
        </aside>
    )
}

SidebarRoutes = React.memo(SidebarRoutes);

export default SidebarRoutes;