import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import Register from "../screens/Register";
import Login from "../screens/Login";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function MainNav(){
	return (
		<Stack.Navigator mode="card">
			<Stack.Screen
				name="Tabs"
				component={TabsNav}
				options={{
          			headerShown: false,
        		}}
			/>			
			<Stack.Screen
				name="Register"
				component={Register}
				options={{
					headerTitle: "회원가입",
					headerBackTitleVisible: false,
					headerTintColor: "black",
				}}				
      		/>
			<Stack.Screen 
				name="Login" 
				component={Login} 
				options={{
					headerTitle: "로그인",
					headerBackTitleVisible: false,
					headerTintColor: "black",
				}}	
			/>
		</Stack.Navigator>
	)
}