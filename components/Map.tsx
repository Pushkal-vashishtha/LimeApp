import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Mapbox, {
  Camera,
  CircleLayer,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import pin from '../assets/pin.png';
import scooters from '~/data/scooters.json';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'LimeApp Location Permission',
          message:
            'LimeApp needs access to your location ' +
            'so you can see your current location on the map.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export default function Map() {
  const points = scooters.map((scooter) => point([scooter.long, scooter.lat]));
  const scooterFeatures = featureCollection(points);
  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={10} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

      <ShapeSource
        id="scooters"
        cluster
        shape={scooterFeatures}
        onPress={(e) => {
          console.log(JSON.stringify(e, null, 2));
        }}>
        <SymbolLayer
          id="pointCount"
          style={{
            textField: ['get', 'point_count'],
            textSize: 16,
            textColor: '#ffffff',
            textPitchAlignment: 'map',
          }}
        />
        <CircleLayer
          id="clusteredScooters"
          belowLayerID="pointCount"
          filter={['has', 'point_count']}
          style={{
            circlePitchAlignment: 'map',
            circleColor: 'green',
            circleRadius: 20,
            circleOpacity: 0.7,
            circleStrokeWidth: 2,
            circleStrokeColor: 'white',
          }}
        />

        <SymbolLayer
          id="scooter-icons"
          filter={['!', ['has', 'point_count']]}
          style={{
            iconImage: 'pin',
            iconSize: 0.5,
            iconAllowOverlap: true,
            iconAnchor: 'bottom',
          }}
        />
        <Images images={{ pin }} />
      </ShapeSource>
    </MapView>
  );
}
