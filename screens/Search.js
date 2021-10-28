import React, { useEffect } from "react";
import { Text, View, TouchableOpacity, TextInput, ActivityIndicator, useWindowDimensions, Image, FlatList } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import {SHOP_FRAGMENT, USER_FRAGMENT, PHOTO_FRAGMENT, CATEGORY_FRAGMENT} from "../fragments";
import { gql, useLazyQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

// 커피샵 검색
const SEARCH_SHOPS = gql`
	query searchCoffeeShops($keyword : String!){
		searchCoffeeShops(keyword : $keyword){			
			...ShopFragment
			user{
				...UserFragment				
			}			
			photos{
				...PhotoFragment				
			}
			categories{
				...CategoryFragment				
			}
		}
	}
	${SHOP_FRAGMENT}
	${USER_FRAGMENT}
	${PHOTO_FRAGMENT}
	${CATEGORY_FRAGMENT}
`

// 기본 레이아웃
const Container = styled.View`
	flex : 1;
	background-color : white;
	align-items : center;
	justify-content : center;
	padding : 0px 20px;
	padding-bottom : 100px;
`;

// 상단 검색 창
const Input = styled.TextInput`
	background-color: rgba(255, 255, 255, 1);
	color: black;
	width: ${(props) => props.width / 1.5}px;
	padding: 5px 10px;
	border-radius: 6px;
`;

// 검색결과 컨테이너
const MessageContainer = styled.View`
	justify-content : center;
	align-items : center;
	flex : 1;
`;

// 검색결과 텍스트
const MessageText = styled.Text`
	margin-top: 10px;
	font-weight: 600;
`;

export default function Search({navigation}){
	// flatlist column 설정
	const numColumns = 3;
	// textinput 길이 설정
	const {width} = useWindowDimensions();
	// react hook form
	const {setValue, register, watch, handleSubmit, getValues } = useForm();
	// lazy query 적용
	const [startQueryFn, {loading, data, called}] = useLazyQuery(
		SEARCH_SHOPS,
		{
			fetchPolicy: "no-cache",
			onCompleted(data) {
				console.log("invoked onCompleted", data);
			  },
			  onError(err) {
				console.log("onerror", err);
			  },
		}
	)
	
	// 검색 버튼 실행
	const onValid = ({keyword}) => {
		startQueryFn({
			variables : {
				keyword,
			}
		})
	}
	
	// 최상단 검색창
	const SearchBox = () => {
		return (
			<View>
			<Input
				width = {width}
				placeholderTextColor = "rgba(0,0,0,0.8)"
				placeholder = "커피숍을 검색해보세요."
				autoCapitalize="none"
				returnKeyLabel="Search"
				returnKeyType="search"
				autoCorrect={false}
				onChangeText={(text)=>setValue("keyword", text)}
				onSubmitEditing={() => 
					startQueryFn({
						variables : {
							keyword : getValues("keyword")
						}
					})
				}
			/>
			</View>
		)
	}
		
	
	
	// header title을 최상단 검색창으로
	useEffect(() => {
		navigation.setOptions({
			headerTitle : SearchBox,
		});
		
		register("keyword" , {
			required : true,
			minLength : 5,
		})
	}, []);
	
	// flatlist renderitem
	// 아직 포토 스크린 없음...
	const renderItem = ({item : shop}) => (
		<TouchableOpacity>
			{
				shop.photos?.map(
					photo => 
					<Image 
						style={{ width: width / numColumns, height: 120 }}
						source={{ uri: photo.url }}
					/> 
				)				
			}	
		</TouchableOpacity>
	)				
	
	// 빈화면 눌렀을 때 키보드가 내려가도록 dismisskeyboard 추가
	return(
		<DismissKeyboard>			
			<Container>
				{loading ? (
					<MessageContainer>
						<ActivityIndicator size="large" />
						<MessageText>검색중 ...</MessageText>
					</MessageContainer>
				) : null}
				{!called ? (
					<MessageContainer>
						<MessageText>검색어를 입력해주세요.</MessageText>
					</MessageContainer>
				) : null}				
				{
					data?.searchCoffeeShops !== undefined ? (
						data?.searchCoffeeShops?.length === 0 ? (
							<MessageContainer>
								<MessageText>해당 커피숍이 없습니다.</MessageText>
							</MessageContainer>
						) : (
							<FlatList
								numColumns={numColumns}
								data = {data?.searchCoffeeShops}
								keyExtractor={(shop) => shop.id + ""}
								renderItem={renderItem}
							/>
						)
					) : null
				}
			</Container>
		</DismissKeyboard>		
	);
}