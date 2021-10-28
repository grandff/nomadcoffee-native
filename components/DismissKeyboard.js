import React from "react";
import {Platform, TouchableWithoutFeedback, Keyboard} from "react-native";

export default function DismissKeyboard({children}){
	// 키보드 사라짐
	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};
	
	// 웹에선 동작안하도록 설정
	return (
		<TouchableWithoutFeedback
			style = {{flex : 1}}
			onPress={dismissKeyboard}
			disabled = {Platform.OS === "web"}
		>
		{children}
		</TouchableWithoutFeedback>
	)
}