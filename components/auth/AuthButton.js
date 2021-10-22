import React from "react";
import styled from "styled-components/native";
import {colors} from "../../colors";
import { ActivityIndicator } from "react-native";

// 버튼
const Button = styled.TouchableOpacity`
	background-color : ${colors.blue}
	padding : 15px 10px;
	border-radius : 3px;
	width : 100%;
	margin-bottom : 80px;
	opacity : ${props => (props.disabled ? "0.5" : "1")}
`;

// 버튼 텍스트
const ButtonText = styled.Text`
	color : white;
	font-weight : 600;
	font-size : 16px;
	text-align : center;
`;

export default function AuthButton({onPress, disabled, text, loading}){
	return (
		<Button disabled={disabled} onPress={onPress}>
			{loading ? <ActivityIndicator color="black" /> : <ButtonText>{text}</ButtonText>}
		</Button>
	)
}