import React from "react";
import {ActivityIndicator, View} from "react-native";
import styled from "styled-components/native";

// 기본 레이아웃
const Container = styled.View`
	flex : 1;
	background-color : white;
	align-items : center;
	justify-content : center;
`;

export default function ScreenLayout({loading, children}){
	return (
		<Container>
			{loading ? <ActivityIndicator color="black" size="large" /> : children}
		</Container>
	)
}