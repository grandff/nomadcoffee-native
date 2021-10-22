import React from "react";
import {TouchableOpacity, View, Text} from "react-native";
import styled from "styled-components/native";
import { logUserOut } from "../apollo";

// 기본 레이아웃
const Container = styled.View`
	flex : 1;
	background-color : white;
	align-items : center;
	justify-content : center;
	padding : 0px 20px;
	padding-bottom : 100px;
`;

export default function Home({navigation}){
	
	return(
		<Container>
			<Text>Home</Text>
			<TouchableOpacity onPress={logUserOut}>
				<Text>로그아웃</Text>
			</TouchableOpacity>
		</Container>
	);
}