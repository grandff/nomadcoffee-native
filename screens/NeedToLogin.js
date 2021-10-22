import React, {useEffect} from "react";
import {TouchableOpacity, View, Text} from "react-native";
import styled from "styled-components/native";
import {colors} from "../colors";

// 기본 컨테이너
const Container = styled.View`
	flex : 1;
	background-color : white;
	align-items : center;
	justify-content : center;
	padding : 0px 20px;
`;

// 우는 모양 이미지
const SadImage = styled.Image`
	width : 120px;
	height : 120px;
`;

// 로그인 안내 문구
const InfoText = styled.Text`
	font-size : 21px;
	font-weight : 500;
	margin-top : 15px;
	margin-bottom : 15px;
`;

// 로그인 화면으로 이동 버튼
const GoToLogin = styled.TouchableOpacity`
	background-color : ${colors.blue};
	padding : 15px 10px;
	border-radius : 3px;
	width : 100%;
	margin-top : 20px;
`;

// 회원가입 화면으로 이동 버튼
const GoToRegister = styled.TouchableOpacity`
	background-color : ${colors.red};
	padding : 15px 10px;
	border-radius : 3px;
	width : 100%;
	margin-top : 20px;
`;

// 버튼 내부 텍스트
const BtnText = styled.Text`
	color : white;
	font-weight : 600;
	font-size : 16px;
	text-align : center;
`;

export default function NeedToLogin({navigation}){
	const goToLogin = () => navigation.navigate("Login");		// 로그인 화면으로 이동
	const goToRegister = () => navigation.navigate("Register");	// 회원가입 화면으로 이동
	// 로그인 안내 페이지는 헤더 안보여주기
	useEffect(() => {				
		navigation.setOptions({
			headerShown : false
		});										 		
	}, [])
	
	return(
		<Container>
			<SadImage source={require("../assets/images/sad.png")} />
			<InfoText>이런! 프로필을 보려면 로그인이 필요해요!</InfoText>		
			<GoToLogin onPress={goToLogin}><BtnText>로그인</BtnText></GoToLogin>
			<GoToRegister onPress={goToRegister}><BtnText>회원가입</BtnText></GoToRegister>
		</Container>		
	);
}