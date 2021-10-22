import React from "react";
import styled from "styled-components/native";
import {Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from "react-native";

// 기본 레이아웃
const Container = styled.View`
	flex : 1;
	background-color : white;
	align-items : center;
	justify-content : center;
	padding : 0px 20px;
	padding-bottom : 100px;
`;

// logo
const Logo = styled.Image`
	position : relative;
	max-width : 80%;
	width : 100%;
	height : 250px;	
	top : 60px;
	margin : 0 auto;
`;

export default function AuthLayout({children}){
	// 키보드 사라지짐
	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};
	
	return (
		<TouchableWithoutFeedback style={{flex : 1}} onPress={dismissKeyboard} disabled={Platform.OS === "web"}>
			<Container>				
				<KeyboardAvoidingView 
					style={{width : "100%"}}
					behavior = "position"
					keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}>
				<Logo resizeMode="contain" source={require("../../assets/nomad_logo.png")} />
				{children}
				</KeyboardAvoidingView>				
			</Container>
		</TouchableWithoutFeedback>		
	)
}
