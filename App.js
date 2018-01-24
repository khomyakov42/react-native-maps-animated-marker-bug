import React from 'react';
import Expo from 'expo';
import {StyleSheet, Text, View, Button, StatusBar, Animated} from 'react-native';


export default class App extends React.Component {

   state = {
      marker: null,
      text: ' '
   };

   position = {longitude: 0, latitude: 0};

   handleAppendMarker() {
      if (this.state.marker) {
         return;
      }

      const animatedValue = new Animated.Value(0);
      const size = 40;
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

      this.setState({
         marker: (
            <Expo.MapView.Marker.Animated style={styles.marker} coordinate={this.position} anchor={{x: 0.5, y: 0.5}}>
               <View style={styles.wrapper}>
                  <Animated.View style={styles.content}/>
               </View>
            </Expo.MapView.Marker.Animated>
         )
      })
   }

   handleRemoveMarker() {
      if (!this.state.marker) {
         return;
      }
      this.setState({marker: null});
   }

   handleChangeRegion(region) {
      this.position = {longitude: region.longitude, latitude: region.latitude};
   }

   render() {
      return (
         <View style={{marginTop: StatusBar.currentHeight, flexDirection: 'column', alignItems: 'stretch', ...StyleSheet.absoluteFillObject}}>
            <View style={{flex: 1}}>
               <Expo.MapView
                  style={{...StyleSheet.absoluteFillObject}}
                  onRegionChange={this.handleChangeRegion.bind(this)}
               >
                  {this.state.marker}
               </Expo.MapView>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
               <Button onPress={this.handleAppendMarker.bind(this)} title={'append'} disabled={!!this.state.marker}/>
               <Button onPress={this.handleRemoveMarker.bind(this)} title={'remove'} disabled={!this.state.marker}/>
            </View>
            <View style={{alignItems: 'center'}}>
               <Text>{this.state.text}</Text>
            </View>
         </View>
      )
   }
}