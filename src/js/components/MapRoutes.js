import React from 'react';
import { YMaps, Map, Placemark, Polyline } from 'react-yandex-maps';
import '../styles/map.css';


let MapRoutes = (props) => {
    const { routes, mapCenter, handleMapBoundsChange, handlePlacemarkDrag } = props;

    const pointsIds = routes.columns['column-1'].pointsIds;
    const coords = pointsIds.map(id => {
        const point = routes.points[id];
        return point.coords;
    });

    const placemarks = pointsIds.map(id => {
        const point = routes.points[id];
        return (
            <Placemark
                key={point.id}
                modules={['geoObject.addon.balloon']}
                geometry={point.coords}
                properties={{
                    balloonContentBody: point.content,
                    id: point.id,
                }}
                options={{ draggable: true }}
                onDrag={handlePlacemarkDrag}
            />
        )

    });

    return (
        <div className='map-wrap'>
            <YMaps query={{ load: "package.full" }}>
                <Map
                    className='map'
                    state={{
                        center: mapCenter,
                        zoom: 11,
                        controls: ['zoomControl', 'fullscreenControl']
                    }}
                    modules={['control.ZoomControl', 'control.FullscreenControl']}
                    onBoundsChange={handleMapBoundsChange}
                >
                    {placemarks}
                    <Polyline
                        geometry={coords}
                        options={{
                            balloonCloseButton: false,
                            strokeWidth: 7,
                            strokeOpacity: 0.8
                        }}
                    />
                </Map>
            </YMaps>
        </div>
    )
}

export default MapRoutes;

MapRoutes = React.memo(MapRoutes);