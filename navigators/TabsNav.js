import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View } from "react-native";
import TabIcon from "../components/nav/TabIcon";
import SharedStackNav from "./SharedStackNav";

const Tab = createBottomTabNavigator();	// tab navigator 호출

export default function TabsNav() {
	return (
	<Tab.Navigator 
		screenOptions={{ 
			tabBarActiveTintColor: '#e91e63', 
				headerShown: false,
		}} 
	>
		 <Tab.Screen
			name="Home"
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<TabIcon iconName={"home"} color={color} focused={focused} />
				),
			}}
		>
			{() => <SharedStackNav screenName="Home" />}
		</Tab.Screen>
		<Tab.Screen
			name="Search"
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<TabIcon iconName={"search"} color={color} focused={focused} />
				),
			}}
		>
			{() => <SharedStackNav screenName="Search" />}
		</Tab.Screen>
		<Tab.Screen
			name="Profile"
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<TabIcon iconName={"person"} color={color} focused={focused} />
				),
			}}
		>
			{() => <SharedStackNav screenName="Profile" />}
		</Tab.Screen>
	</Tab.Navigator>
	)
}