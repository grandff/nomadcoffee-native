import React, {useEffect, useState} from "react";
import {TouchableOpacity, View, Text} from "react-native";
import styled from "styled-components/native";

// 기본 레이아웃
const Container = styled.View`
	flex : 1;
	background-color : white;
	align-items : center;
	justify-content : center;
	padding : 0px 20px;
	padding-bottom : 100px;
`;

export default function Profile({navigation, route}){
	
	// parameter로 받은 것들 중에 사용자 이름이 있으면 title 을 변경해주도록 처리
	useEffect(() => {				
		/*
		if(route?.params?.username){
			// navigation의 function  중 setOptions 사용
			// 헤더 옵션들 다 수정할 수가 있음
			navigation.setOptions({
				title : route.params.username
			});
		}*/												 		
	}, [])
	
	return(
		<Container>
			<Text>Profile</Text>
			<Text>이 화면이 보이면 로그인에 성공한것임</Text>
		</Container>
	);
}