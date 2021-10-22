import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Search from "../screens/Search";
import NeedToLogin from "../screens/NeedToLogin";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar, tokenVar, cache } from "../apollo";

const Stack = createStackNavigator();

export default function SharedStackNav({ screenName }){
	// 로그인 유무 확인
	const isLoggedIn = useReactiveVar(isLoggedInVar);	
	
	// login, profile 화면은 공유
	return (
		<Stack.Navigator
		  screenOptions={{
			headerBackTitleVisible: false,
			headerTintColor: "black",
			headerStyled: {
			  shadowColor: "rgba(0,0,0,0.3)",
			  backgroundColor: "white",
			},
			headerStyle: {
			  height: 110,
			},
			headerMode: "screen",
		  }}
		>
			{screenName === "Home" ? 
				<Stack.Screen
				  name={"Home"}
				  component={Home}
				  options={{
					headerTitle: () => (
					  <Image
						source={require("../assets/nomad_logo.png")}
						resizeMode="cover"
						style={{ width: 160, height: 150 }}
					  />
					),
				  }}
				/>
			: null}
			{screenName === "Search" ? <Stack.Screen name="Search" component={Search} /> : null}
			{screenName === "Profile" && isLoggedIn ? 
				<Stack.Screen name="Profile" component={Profile} />
				: 
				<Stack.Screen name="NeedToLogin" component={NeedToLogin} />
			}     					
		</Stack.Navigator>
	)
}