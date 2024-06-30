import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Mapbox, { Camera, LocationPuck, MapView } from "@rnmapbox/maps";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "LimeApp Location Permission",
          message: "LimeApp needs access to your location " +
            "so you can see your current location on the map.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export default function Map() {
  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={16} />
     <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{isEnabled:true}} />
    </MapView>
  );
}
