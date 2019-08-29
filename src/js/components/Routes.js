import React, { useState, useCallback } from 'react';
import SidebarRoutes from './SidebarRoutes.js';
import MapRoutes from './MapRoutes.js';

export let counter = {value: 0};

let Routes = () => {
    const initialRoutes = {
        points: {},
        columns: {
            'column-1': {
                id: 'column-1',
                pointsIds: [],
            }
        },
        columnOrder: ['column-1'],
    }

    const [routes, setRoutes] = useState(initialRoutes);
    const [mapCenter, setMapCenter] = useState([56.02279830, 92.89742900]);


    //add coords
    const handleInput = useCallback(
        (e) => {
            if (e.key !== 'Enter') return;

            const inputValue = e.target.value;
            if (inputValue === '') return;

            const id = counter.value;

            const column = routes.columns['column-1'];
            const newPointsIds = Array.from(column.pointsIds);
            newPointsIds.push(`point-${id}`);
            const newColumn = {
                ...column,
                pointsIds: newPointsIds
            }

            const newRoutes = {
                ...routes,
                points: {
                    ...routes.points,
                    [`point-${id}`]: {
                        id: `point-${id}`,
                        content: inputValue,
                        coords: mapCenter,
                    },
                },
                columns: {
                    ...routes.columns,
                    ['column-1']: newColumn,
                }
            };

            setRoutes(newRoutes);

            e.target.value = '';
            counter.value++;
        },
        [routes, mapCenter]
    )

    //change coords of placemark
    const handlePlacemarkDrag = useCallback(
        (e) => {
            const target = e.get('target');
            const id = target.properties.get('id');
            const currentCoords = target.geometry.getCoordinates();

            const point = routes.points[id];
            const newPoint = {
                ...point,
                coords: currentCoords,
            }

            const newRoutes = {
                ...routes,
                points: {
                    ...routes.points,
                    [id]: newPoint,
                },
            };

            setRoutes(newRoutes);
        },
        [routes]
    )

    //change mapCenter
    const handleMapBoundsChange = useCallback(
        (e) => {
            const newCenter = e.get('newCenter');
            setMapCenter(newCenter);
        },
        [mapCenter]
    )

    //delete placemark
    const handleSidebarItemDelete = useCallback(
        (e) => {
            let target = e.target;
            if (!target.classList.contains('close-item')) return;

            while (target) {
                if (target.tagName == 'LI') break;
                target = target.parentNode;
            }

            if (!target) return;

            if (!target.hasAttribute('data-id') || !target.hasAttribute('data-index')) return;

            const id = target.dataset.id;
            const index = target.dataset.index;

            const column = routes.columns['column-1'];
            const newPointsIds = Array.from(column.pointsIds);
            newPointsIds.splice(index, 1);
            const newColumn = {
                ...column,
                pointsIds: newPointsIds
            }

            delete routes.points[id];

            const newRoutes = {
                ...routes,
                columns: {
                    ...routes.columns,
                    ['column-1']: newColumn,
                },
            }

            setRoutes(newRoutes);
        },
        [routes]
    )

    //change order of placemarks
    const handleSidebarItemDrag = useCallback(
        (result) => {
            const { source, destination, draggableId } = result;
            if (!destination) return;
            if (destination.droppableId === source.droppableId && destination.index === source.index) return;

            const column = routes.columns['column-1'];
            const newPointsIds = Array.from(column.pointsIds);

            newPointsIds.splice(source.index, 1);
            newPointsIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...column,
                pointsIds: newPointsIds
            }

            const newRoutes = {
                ...routes,
                columns: {
                    ...routes.columns,
                    ['column-1']: newColumn,
                }
            }

            setRoutes(newRoutes);
        },
        [routes]
    )

    const propsSidebarRoutes = {
        routes,
        handleInput,
        handleSidebarItemDelete,
        handleSidebarItemDrag,
    }

    const propsMapRoutes = {
        routes,
        mapCenter,
        handleMapBoundsChange,
        handlePlacemarkDrag,
    }

    return (
        <React.Fragment>
            <SidebarRoutes {...propsSidebarRoutes} />
            <MapRoutes {...propsMapRoutes} />
        </React.Fragment>
    )
}

Routes = React.memo(Routes);

export default Routes;