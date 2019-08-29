import React from 'react';
import { mount } from 'enzyme';
import SidebarRoutes from '../SidebarRoutes.js';

describe('SidebarRoutes', () => {
    const routesWithPoints = {
        points: {
            'point-0': { id: 'point-0', coords: [56.02279830, 92.89742900], content: 'точка 1' },
            'point-1': { id: 'point-1', coords: [56.02279830, 92.89742900], content: 'точка 2' },
            'point-2': { id: 'point-2', coords: [56.02279830, 92.89742900], content: 'точка 3' },
            'point-3': { id: 'point-3', coords: [56.02279830, 92.89742900], content: 'точка 4' },
        },
        columns: {
            'column-1': {
                id: 'column-1',
                pointsIds: ['point-0', 'point-1', 'point-2', 'point-3'],
            }
        },
        columnOrder: ['column-1'],
    }

    const routesWithoutPoints = {
        points: {},
        columns: {
            'column-1': {
                id: 'column-1',
                pointsIds: [],
            }
        },
        columnOrder: ['column-1'],
    }    

    const handleInput = jest.fn();
    const handleSidebarItemDelete = jest.fn();
    const handleSidebarItemDrag = () => {};

    const propsWithPoints = {
        routes: routesWithPoints,
        handleInput,
        handleSidebarItemDelete,
        handleSidebarItemDrag,
    }

    const propsWithoutPoints = {
        routes: routesWithoutPoints,
        handleInput,
        handleSidebarItemDelete,
        handleSidebarItemDrag,
    }

    let renderedComponent;

    function mountComponentWithPoints() {
        renderedComponent = mount(<SidebarRoutes {...propsWithPoints} />);
    }

    test('SidebarRoutes component renders correctly', () => {
        mountComponentWithPoints();
        
        expect(renderedComponent).toMatchSnapshot();
    });


    test('number of lis is equal to number of points', () => {
        mountComponentWithPoints();
        const lis = renderedComponent.find('.map-sidebar__list__item');

        const column = routesWithPoints.columns['column-1'];
        const pointsLength = column.pointsIds.length;

        expect(lis.length).toBe(pointsLength);
    });
    

    test('lis do not exist without points', () => {
        const renderedComponent = mount(<SidebarRoutes {...propsWithoutPoints} />);

        const lis = renderedComponent.find('.map-sidebar__list__item');
        expect(lis.length).toBe(0);
    }); 
 

    describe('render lis in right order', () => {
        mountComponentWithPoints();

        const column = routesWithPoints.columns['column-1'];
        const points = column.pointsIds.map(point => {
            return routesWithPoints.points[point];
        });

        const lis = renderedComponent.find('.map-sidebar__list__item');

        points.forEach((point, index) => {
            describe(`li-${index} matches ${point.id}`, () => {
                const li = lis.at(index);

                test(`data-id attribute matches point-id`, () => {
                    expect(li.prop('data-id')).toBe(point.id);
                })

                test(`data-index attribute matches point-index`, () => {
                    expect(li.prop('data-index')).toBe(index);
                })  
                
                test(`innerHTML matches point-content`, () => {
                    const liContent = li.find('span').first().text();
                    expect(liContent).toBe(point.content);
                })                 
            })
        })
    });
    

    test('onKeyDown callback has been called', () => {
        mountComponentWithPoints();

        const input = renderedComponent.find('.map-sidebar__input');  
        input.simulate('keydown');
        expect(handleInput).toHaveBeenCalled();      
    });  
    

    test('onClick callback has been called', () => {
        mountComponentWithPoints();

        const closeItem = renderedComponent.find('.close-item').first();  
        closeItem.simulate('click');
        expect(handleSidebarItemDelete).toHaveBeenCalled();  
    }); 
});


