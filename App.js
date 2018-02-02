import React from 'react';
import Expo from 'expo';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import {StyleSheet, Text, View, StatusBar, Animated} from 'react-native';


const INITIAL_REGION = {longitude: 90, latitude: 0, longitudeDelta: 90, latitudeDelta: 45};


@observer
export default class App extends React.Component {

   @observable
   markers = [];

   @observable
   text = ' ';

   constructor(props, context) {
      super(props, context);
      this.coordinates = [];

      const width = 4;
      const height = 8;
      for (let i = 0; i < width; ++i) {
         const lngStep = INITIAL_REGION.longitudeDelta / width;
         const latStep = INITIAL_REGION.latitudeDelta / height;

         const lng = INITIAL_REGION.longitude - INITIAL_REGION.longitudeDelta / 2 + (lngStep * i) + lngStep / 2;
         for (let j = 0; j < height; ++j) {
            const lat = INITIAL_REGION.latitude - INITIAL_REGION.latitudeDelta / 2 + (latStep * j) - latStep / 2;
            const coordinate = {latitude: lat, longitude: lng};
            this.coordinates.push(coordinate);
         }
      }

   }

   componentDidMount() {
      const loop = action(() => {
         this.markers.splice(0);
         this.text = 'empty';
         setTimeout(action(() => {
            this.createAnimatedMarkers(loop);
            this.text = 'render';
         }), 2000);
      });
      loop();
   }


   createAnimatedMarkers(callback) {
      const animatedValue = new Animated.Value(0);
      const size = 20;
      const styles = {
         marker: {
            opacity: animatedValue,
            width: size, height: size
         },
         content: {
            borderTopLeftRadius: size / 2,
            borderTopRightRadius: size / 2,
            borderBottomRightRadius: size / 2,
            borderBottomLeftRadius: size / 2,
            width: size,
            height: size,
            backgroundColor: '#F6072C',
            borderColor: '#9F2C12',
            borderWidth: 2
         }
      };

      Animated.timing(animatedValue, {
         toValue: 1,
         duration: 3500,
         useNativeDriver: true
      }).start(callback);

      const markers = [];
      for (let coordinate of this.coordinates) {
         markers.push(
            <Expo.MapView.Marker.Animated
               key={markers.length + 1}
               style={styles.marker}
               coordinate={coordinate}
               anchor={{x: 0.5, y: 0.5}}
            >
               <View style={styles.content}/>
            </Expo.MapView.Marker.Animated>
         )
      }

      this.markers.push(...markers);
   }

   render() {
      return (
         <View style={{marginTop: StatusBar.currentHeight, flexDirection: 'column', alignItems: 'stretch', ...StyleSheet.absoluteFillObject}}>
            <View style={{flex: 1}}>
               <Expo.MapView
                  style={{...StyleSheet.absoluteFillObject}}
                  initialRegion={INITIAL_REGION}
               >
                  {this.markers}
               </Expo.MapView>
            </View>
            <View style={{alignItems: 'center'}}>
               <Text>{this.text}</Text>
            </View>
         </View>
      )
   }
}