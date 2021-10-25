import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import ShopLayout from "./ShopLayout";
import { Image, useWindowDimensions, View } from "react-native";

// 카페 사진
const ShopImage = styled.Image`
	width : 180px;	
	height : 180px;
	margin-right : 15px;
`;

// 카페 정보 컨테이너
const ShopSubContainer = styled.View`
	flex : 1;
`;

// 카페 제목
const ShopTitle = styled.Text`
	font-size : 16px;
	font-weight : bold;
`;

// 카테고리, 등록일이 들어가는 컨테이너
const ShopDateCateContainer = styled.View`	
	width : 100%;
	flex : 1;
	justify-content: flex-end;
`;

// 카페 카테고리
const ShopCateogires = styled.Text`
	font-style: italic;
	font-size : 14px;
`;

// 글 등록일
const ShopRegDate = styled.Text`
	font-size : 11px;
	color : gray;
	text-align : right;	
`;


function Shop({id, user, name, caption, photos, categories, createdAt}){
	// 정확한 사진 사이즈 가져오기위한 현재 디바이스 가로세로값. 이건 나중에 써봐야할듯??
  	const { width, height } = useWindowDimensions();
	const newWidth = width - 225;		// subcontainer 너비
	const regDate = createdAt.split("T");
	return (
		<ShopLayout>
			{
				photos?.map(
					photo => 
					<ShopImage 
						resizeMode="cover"
						source={{ uri: photo.url }}
					/> 
				)				
			}			
			<ShopSubContainer style = {{ width : newWidth }}>
				<ShopTitle>{name.length > 10 ? name.substring(0, 10) + "..." : name}</ShopTitle>
				<ShopDateCateContainer>
					<ShopCateogires>
						{
							categories?.map(
								item => item.category + " "
							)
						}
					</ShopCateogires>
					<ShopRegDate>{regDate[0]}</ShopRegDate>
				</ShopDateCateContainer>			
			</ShopSubContainer> 
		</ShopLayout>
	)	
}


export default Shop;