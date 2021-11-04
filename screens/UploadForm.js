import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Text ,View, ActivityIndicator, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import {ReactNativeFile} from "apollo-upload-client";

// coffee shop insert mutation
const INSERT_MUTATION = gql`
	mutation createCoffeeShop(
		$name : String!
		$caption : String
		$latitude : String
		$longitude : String
		$file : Upload!
	){
		createCoffeeShop(
			name : $name
			caption : $caption
			latitude : $latitude 
			longitude : $longitude
			file : $file
		){
			id
		}
	}
`;

// 전체 컨테이너
const Container = styled.View`
	flex : 1;
	background-color : black;
	padding : 0px 50px;
`;

// 사진 영역
const Photo = styled.Image`
	height : 350px;
`;

// 설명 컨테이너
const CaptionContainer = styled.View`
	background-color : white;
	color : black;
	padding : 10px 20px;
	border-radius : 10px;
`;

// 설명
const Caption = styled.TextInput`
	background-color : white;
	color : black;
	padding : 10px 20px;
	border-radius : 10px;
`;

// 이름 컨테이너
const NameContainer = styled.View`
	background-color : white;
	color : black;
	padding : 10px 20px;
	border-radius : 10px;
	margin-bottom : 10px;
`;

// 이름
const NameText = styled.TextInput`
	background-color : white;
	color : black;
	padding : 10px 20px;
	border-radius : 10px;
`;

// 오른쪽 상단 텍스트
const HeaderRightText = styled.Text`
	color : white;
	font-size : 16px;
	font-weight : 600;
	margin-right : 7px;
`;


export default function UploadForm({route, navigation}){
	const client = useApolloClient();	// oncompleted를 위한 cache 수정
	// 업로드 후 캐시 업데이트
	const updateUploadShop = (data) => {				
		console.log("update!!", data);
		// get data		
		const { createCoffeeShop } = data;
		
		// cache 업데이트
		if (createCoffeeShop.id) {
			const { cache } = client;
			cache.modify({
				id : "ROOT_QUERY",
				fields : {
					seeCoffeeShops(prev) { 
						return [createCoffeeShop, ...prev]; 
					}, 
				}
			});
			
			// 메인화면으로 이동
			navigation.navigate("Tabs");			
		}else{
			alert("등록 중 오류가 발생했습니다.")
		}		
	}
	
	const [createCoffeeShopMutation, {loading}] = useMutation(INSERT_MUTATION, {
		update : updateUploadShop
	});	// create coffee shop mutation
	const {register, handleSubmit, setValue} = useForm();	// react hook form
	
	// 전송 버튼 누른 후 로딩
	const HeaderRightLoading = () => (
		<ActivityIndicator size="small" color="white" style={{marginRight : 10}} />
	)
	
	// 헤더 우측 전송 버튼
	const HeaderRight = () => (
		<TouchableOpacity onPress={handleSubmit(onValid)}>
			<HeaderRightText>등록</HeaderRightText>
		</TouchableOpacity>
	)			
	
	// 등록 처리
	useEffect(() => {
		register("name");
		register("caption");
	}, [register]);
	
	// 상단 우측 버튼 설정
	useEffect(() => {
		navigation.setOptions({
			headerRight : loading ? HeaderRightLoading : HeaderRight			
		});
	}, [loading]);
	
	// form usbmit
	const onValid = ({name, caption}) => {
		console.log("uri ::" , route.params.file);
		
		const file = new ReactNativeFile({
			uri : route.params.file,
			name : `1.jpg`,
			type : "image/jpeg"
		});
		
		createCoffeeShopMutation({
			variables : {
				name,
				caption,
				file
			}
		});
	}
	
	return (
		<DismissKeyboard>
			<Container>
				<Photo resizeMode="contain" source={{uri : route.params.file}}/>
				<NameContainer>
					<NameText 
						placeholder = "이름을 적어주세요." 
						placeholderTextColor = "rgba(0, 0, 0, 0.5)"
						onChangeText={text => setValue("name", text)}	
						returnKeyType="next"
					/>
				</NameContainer>
				<CaptionContainer>
					<Caption 
						placeholder = "설명을 적어주세요." 
						placeholderTextColor = "rgba(0, 0, 0, 0.5)"
						onChangeText={text => setValue("caption", text)}
						onSubmitEditing={handleSubmit(onValid)}
						returnKeyType="done"
					/>
				</CaptionContainer>
			</Container>
		</DismissKeyboard>
	)
}