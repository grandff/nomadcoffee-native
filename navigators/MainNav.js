import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import UploadNav from "./UploadNav"
import Register from "../screens/Register";
import UploadForm from "../screens/UploadForm";
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
				name="Upload"
				component={UploadNav}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
        		name="UploadForm"
        		component={UploadForm}
        		options={{
          			title: "업로드",
          			headerTintColor: "white",
          			headerStyle: {
            			backgroundColor: "black",
          			},
          			headerBackTitleVisible: false,
          			headerBackImage: ({ tintColor }) => (
            			<Ionicons name="close" size={28} color={tintColor} />
          			),
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