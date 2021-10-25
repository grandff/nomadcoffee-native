import React from "react";
import styled from "styled-components/native";
import { useWindowDimensions } from "react-native";

// 기본 레이아웃
const Container = styled.View`
	flex-direction: row;
	padding : 15px;
`;

export default function ShopLayout({children}){
	const { width } = useWindowDimensions();
	return (
		<Container style={{width}}>
			{children}
		</Container>
	)
}