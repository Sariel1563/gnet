// MapScreen.js
import 'react-native-get-random-values';
import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Add = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const mapRef = useRef(null);
  
  const getZoomLevel = (region) => {
    const ZOOM_LEVEL_CONSTANTS = {
      WORLD: 3,
      COUNTRY: 5,
      STATE: 7,
      CITY: 10
    };
    return Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
  };

  const getGlowRadius = (zoomLevel) => {
    if (zoomLevel < 4) return 500000; // World view
    if (zoomLevel < 6) return 200000; // Country view
    if (zoomLevel < 8) return 50000;  // State view
    return 10000; // City view
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 90,
          longitudeDelta: 90,
        }}
        onRegionChange={(region) => {
          const zoom = getZoomLevel(region);
          setMarkers(prev => prev.map(marker => ({
            ...marker,
            glowRadius: getGlowRadius(zoom)
          })));
        }}
      >
        {markers.map((marker, index) => (
          <React.Fragment key={index}>
            <Marker
              coordinate={marker.coordinate}
              title={marker.title}
              onPress={() => setSelectedMarker(marker)}
            />
            <Circle
              center={marker.coordinate}
              radius={marker.glowRadius}
              fillColor="rgba(255, 215, 0, 0.3)"
              strokeColor="rgba(255, 215, 0, 0.5)"
            />
          </React.Fragment>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalView}>
          <GooglePlacesAutocomplete
            placeholder="Search location"
            fetchDetails={true}
            onPress={(data, details = null) => {
              const newMarker = {
                coordinate: {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                },
                title: data.description,
                glowRadius: getGlowRadius(getZoomLevel(mapRef.current.getRegion()))
              };
              setMarkers([...markers, newMarker]);
              setShowModal(false);
              mapRef.current.animateToRegion({
                ...newMarker.coordinate,
                latitudeDelta: 1,
                longitudeDelta: 1,
              });
            }}
            query={{
              key: 'AIzaSyDGpJukq8hEnSj-igdsKbjdXpDZzPf36ZI',
              language: 'en',
            }}
            styles={{
              container: styles.autocompleteContainer,
              textInput: styles.autocompleteInput,
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  modalView: {
    flex: 1,
    marginTop: 60,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  autocompleteContainer: {
    flex: 1,
    position: 'relative',
  },
  autocompleteInput: {
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Add;