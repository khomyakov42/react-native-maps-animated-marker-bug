import React from 'react';
import Expo from 'expo';
import {StyleSheet, Text, View, Button, StatusBar, Animated} from 'react-native';


export default class App extends React.Component {

   state = {
      markers: null,
      text: ' '
   };

   region = {longitude: 90, latitude: 0, longitudeDelta: 90, latitudeDelta: 45};

   handleAppendMarker() {
      if (this.state.marker) {
         return;
      }

      const animatedValue = new Animated.Value(0);
      const size = 20;
      const styles = {
         marker: {
            opacity: animatedValue
         },
         wrapper: {
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

      this.setState({text: 'animation started'});

      Animated.timing(animatedValue, {
         toValue: 1,
         duration: 3000,
         useNativeDriver: true
      }).start(() => {
         this.setState({text: 'animation complete'});
      });

      const markers = [];
      const width = 4;
      const height = 6;

      for (let i = 0; i < width; ++i) {
         const lngStep = this.region.longitudeDelta / width;
         const latStep = this.region.latitudeDelta / height;

         const lng = this.region.longitude - this.region.longitudeDelta / 2 + (lngStep * i) + lngStep / 2;
         for (let j = 0; j < height; ++j) {
            const lat = this.region.latitude - this.region.latitudeDelta / 2 + (latStep * j) - latStep / 2;
            const anchor = {x: 0.5, y: 0.5};
            const coordinate = {latitude: lat, longitude: lng};

            markers.push(
               <Expo.MapView.Marker.Animated
                  key={i * height + j}
                  style={styles.marker}
                  coordinate={coordinate}
                  anchor={anchor}
               >
                  <View style={styles.wrapper}>
                     <Animated.View style={styles.content}/>
                  </View>
               </Expo.MapView.Marker.Animated>
            )
         }
      }

      this.setState({
         markers: markers
      });
   }

   handleRemoveMarker() {
      if (!this.state.markers) {
         return;
      }
      this.setState({markers: null});
   }

   handleChangeRegion(region) {
      this.region = region;
   }

   render() {
      return (
         <View style={{marginTop: StatusBar.currentHeight, flexDirection: 'column', alignItems: 'stretch', ...StyleSheet.absoluteFillObject}}>
            <View style={{flex: 1}}>
               <Expo.MapView
                  style={{...StyleSheet.absoluteFillObject}}
                  initialRegion={this.region}
                  onRegionChange={this.handleChangeRegion.bind(this)}
               >
                  {this.state.markers}
               </Expo.MapView>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
               <Button onPress={this.handleAppendMarker.bind(this)} title={'append'} disabled={!!this.state.markers}/>
               <Button onPress={this.handleRemoveMarker.bind(this)} title={'remove'} disabled={!this.state.markers}/>
            </View>
            <View style={{alignItems: 'center'}}>
               <Text>{this.state.text}</Text>
            </View>
         </View>
      )
   }
}