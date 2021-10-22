import React, {useState} from 'react';
import {Ionicons} from "@expo/vector-icons";
import * as Font from "expo-font";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppLoading from "expo-app-loading";
import {Asset} from "expo-asset";
import {NavigationContainer} from"@react-navigation/native";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { isLoggedInVar, tokenVar, cache } from "./apollo";
import MainNav from "./navigators/MainNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";

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
		// 추가 static 이미지들도 추가해놓기..?
		const imagesToLoad = [require("./assets/nomad_logo.png"), require("./assets/images/sad.png")];
		const imagePromises = imagesToLoad.map(image => Asset.loadAsync(image));
		
		return Promise.all([...fontPromises, ...imagePromises]);
	}
	
	// preloadAssets
	const preload = async () => {
		// asyncstorage에서 토큰 값 가져오기
		const token = await AsyncStorage.getItem("token");		
		if(token){
			// token이 있으면 apollo 변수 업데이트 처리
			isLoggedInVar(true);
			tokenVar(token);
		}
		
		// 캐시 유지		
		await persistCache({
			cache,
			storage : new AsyncStorageWrapper(AsyncStorage),			
		});
		
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
	  <ApolloProvider client={client}>
		  <NavigationContainer>
			<MainNav />
		  </NavigationContainer>
	  </ApolloProvider>
  );
}