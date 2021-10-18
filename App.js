import React, {useState} from 'react';
import {Ionicons} from "@expo/vector-icons";
import * as Font from "expo-font";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppLoading from "expo-app-loading";
import {Asset} from "expo-asset";

export default function App() {
	const [loading, setLoading] = useState(true);		// 로딩 확인 변수
	const onFinish = () => setLoading(false);			// 로딩 완료 시 로딩 변수 변경
	
	// asset preload(font, image)
	const preloadAssets = () => {
		// font load
		const fontsToLoad = [Ionicons.font];
		// font promise 실행(배열리턴)
		const fontPromises = fontsToLoad.map(font => Font.loadAsync(font));		
		// 로컬, 온라인 순으로 배열 (로고 따로 만들어서 빼놓기)
		const imagesToLoad = [require("./assets/icon.png"), "https://i0.wp.com/www.dafontfree.io/wp-content/uploads/2020/12/instagram-new.png?resize=1100%2C750&ssl=1"];
		const imagePromises = imagesToLoad.map(image => Asset.loadAsync(image));
		
		return Promise.all([...fontPromises, ...imagePromises]);
	}
	
	// preloadAssets
	const preload = async () => {
		return preloadAssets();
	}
	
	// loading 중이면 AppLoading 호출
	if(loading){
		return <AppLoading 
					startAsync={preload}
				   	onError={console.warn}
				   	onFinish={onFinish}   
				/>
	}
	
	
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
