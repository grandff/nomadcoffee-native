import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// 화면 상단에 버튼을 추가할 화면 같은 경우 스크린안에서 navigator를 렌더링 하는 방식으로 구현
export default function UploadNav({route}){
	// 아바타 사진 구분 
	const avatarFile = route?.params?.profile ?? false;
	
	return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBarOptions={{
        style: {
          backgroundColor: "black",
        },
        activeTintColor: "white",
        indicatorStyle: {
          backgroundColor: "white",
          top: 0,
        },
      }}
    >
      <Tab.Screen name="Select">
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerTintColor: "white",
              headerBackTitleVisible: false,
              headerBackImage: ({ tintColor }) => (
                <Ionicons color={tintColor} name="close" size={28} />
              ),
              headerStyle: {
                backgroundColor: "black",
                shadowOpacity: 0.3,
              },
            }}
          >
            <Stack.Screen
              name="Select"
              component={SelectPhoto}
              options={{ title: "Choose a photo" }}
              initialParams={{ avatarFile }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Take"
        component={TakePhoto}
        initialParams={{ avatarFile }}
      />
    </Tab.Navigator>
  );
}