import React from 'react';
import { shallow, mount } from 'enzyme';
import Routes from '../Routes.js';
import { counter } from '../Routes.js';

describe('Routes', () => {
    let renderedComponent;

    function mountComponent() {
        counter.value = 0;
        renderedComponent = mount(<Routes />);
    }

    test('Routes component renders correctly', () => {
        counter.value = 0;
        const renderedComponent = shallow(<Routes />);
        expect(renderedComponent).toMatchSnapshot();
    });


    test('Routes component renders with initial state', () => {
        mountComponent();

        const lisLength = renderedComponent.find('.map-sidebar__list__item').length;
        expect(lisLength).toBe(0);
    });


    test('InputHandle does not add li with empty value', () => {
        mountComponent();

        const input = renderedComponent.find('.map-sidebar__input');
        
        input.simulate('keydown', {key: 'Enter', target: { value: '' }});
        let lisLength = renderedComponent.find('.map-sidebar__list__item').length;
        expect(lisLength).toBe(0);

        input.simulate('keydown', {key: 'Enter', target: { value: 'Точка маршрута 1' }});
        lisLength = renderedComponent.find('.map-sidebar__list__item').length;
        expect(lisLength).toBe(1);
    });  


    test('InputHandle adds li with Enter key only', () => {
        mountComponent();

        const input = renderedComponent.find('.map-sidebar__input');

        input.simulate('keydown', {key: 'Tab', target: { value: 'Точка маршрута 1' }});
        let lisLength = renderedComponent.find('.map-sidebar__list__item').length;
        expect(lisLength).toBe(0);

        input.simulate('keydown', {key: 'Control', target: { value: 'Точка маршрута 1' }});
        lisLength = renderedComponent.find('.map-sidebar__list__item').length;
        expect(lisLength).toBe(0);

        input.simulate('keydown', {key: 'Enter', target: { value: 'Точка маршрута 1' }});
        lisLength = renderedComponent.find('.map-sidebar__list__item').length;
        expect(lisLength).toBe(1);
    });

    
    describe('InputHandle adds li right', () => {
        mountComponent();

        const input = renderedComponent.find('.map-sidebar__input');

        describe('first li was added', () => {
            const inputValue = 'Точка маршрута 1';
            input.simulate('keydown', {key: 'Enter', target: { value: inputValue }});
            const lis = renderedComponent.find('.map-sidebar__list__item');
            const li = lis.first();

            test('number of lis increased by one', () => {
                expect(lis.length).toBe(1);
            });

            test('li has valid id', () => {
                expect(li.prop('data-id')).toBe('point-0');
            });

            test('li has been added to the end of list', () => {
                expect(li.prop('data-index')).toBe(lis.length - 1);
            });

            test('li text is equal to input value', () => {
                const liText = li.find('span').first().text();
                expect(liText).toBe(inputValue);
            });
        });


        describe('second li was added', () => {
            const inputValue = 'Точка маршрута 2';
            input.simulate('keydown', {key: 'Enter', target: { value: inputValue }});
            const lis = renderedComponent.find('.map-sidebar__list__item');
            const li = lis.at(1);

            test('number of lis increased by one', () => {
                expect(lis.length).toBe(2);
            });

            test('li has valid id', () => {
                expect(li.prop('data-id')).toBe('point-1');
            });

            test('li has been added to the end of list ', () => {
                expect(li.prop('data-index')).toBe(lis.length - 1);
            });

            test('li text is equal to input value', () => {
                const liText = li.find('span').first().text();
                expect(liText).toBe(inputValue);
            });
        })

    });


    test('handleSidebarItemDelete do not work with ul nested elements except .close-item', () => {
        mountComponent();

        const input = renderedComponent.find('.map-sidebar__input');
        input.simulate('keydown', {key: 'Enter', target: { value: 'Точка маршрута 1' }}); 
        
        let lis = renderedComponent.find('.map-sidebar__list__item');
        const li = lis.first();
        li.simulate('click');
        lis = renderedComponent.find('.map-sidebar__list__item');
        expect(lis.length).toBe(1);

        const content = li.find('span').first();
        content.simulate('click');
        lis = renderedComponent.find('.map-sidebar__list__item');
        expect(lis.length).toBe(1);

        const closeItem = li.find('.close-item');
        closeItem.simulate('click');
        lis = renderedComponent.find('.map-sidebar__list__item');
        expect(lis.length).toBe(0);
    });


    describe('handleSidebarItemDelete removes li right', () => {
        mountComponent();

        const input = renderedComponent.find('.map-sidebar__input');
        const values = ['точка маршрута 1', 'точка маршрута 2', 'точка маршрута 3'];
        values.forEach(value => {
            input.simulate('keydown', {key: 'Enter', target: { value: value }});         
        });

        let lis = renderedComponent.find('.map-sidebar__list__item');

        const li = lis.at(1);
        const id = li.prop('data-id');
        const closeItem = li.find('.close-item');
        closeItem.simulate('click');

        lis = renderedComponent.find('.map-sidebar__list__item');

        test('number of lis decreased by one', () => {
            expect(lis.length).toBe(2);
        });

        test('deleted li has valid id', () => {
            expect(lis.exists(`li[data-id='${id}']`)).toBeFalsy();  
        });

        test('remaining lis changed their data-index according to new order', () => {
            lis.forEach((li, index) => {
                expect(li.prop('data-index')).toBe(index);
            })
        });
    });    


    test('lis have unique id after repeated adding and removing', () => {
        mountComponent();

        const input = renderedComponent.find('.map-sidebar__input');
        const values = ['точка маршрута 1', 'точка маршрута 2', 'точка маршрута 3'];
        values.forEach(value => {
            input.simulate('keydown', {key: 'Enter', target: { value: value }});         
        });       
        
        let lis = renderedComponent.find('.map-sidebar__list__item');

        const li = lis.at(1);
        const closeItem = li.find('.close-item');
        closeItem.simulate('click');

        input.simulate('keydown', {key: 'Enter', target: { value: 'еще одна точка маршрута' }});
        lis = renderedComponent.find('.map-sidebar__list__item');
        
        lis.forEach((li) => {
            const id = li.prop('data-id');
            expect(lis.find(`li[data-id='${id}']`).length).toBe(1);  
        })
    });
})

