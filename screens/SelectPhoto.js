import React, {useEffect, useState} from "react";
import {TouchableOpacity, View, Text, FlatList, useWindowDimensions, Image} from "react-native";
import styled from "styled-components/native";
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from "@expo/vector-icons";

// 전체 컨테이너
const Container = styled.View`
	flex : 1;
`;

// 선택한 사진 화면
const SelectPhotoContainer = styled.View`
	flex : 1;
	background-color : gray;
`;

// 갤러리 목록
const SelectListContainer = styled.View`
	flex : 1;
	background-color :black;
`;

// 오른쪽 상단 다음 버튼
const HeaderRightText = styled.Text`
	color : white;
	font-size : 16px;
	font-weight : 600;
	margin-right : 7px;
`;

// 아이콘 컨테이너
const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 0px;
`;

export default function SelectPhoto({route, navigation}){
	const [ok, setOk] = useState(false);					// 사진 설정 확인
	const [photos, setPhotos] = useState([]);				// 사진 목록 배열
	const [chosenPhoto, setChosenPhoto] = useState("");		// 선택한 사진 설정
	const avatarFile = route?.params?.avatarFile ?? false; // 아바타 사진 업로드 여부
	const numColumns = 4;		// 가로 숫자
	const { width } = useWindowDimensions(); // 폰 가로 사이즈
	
	// 사진 선택 시 상단 컨테이너에 보여줌
	const choosePhoto = (uri) => {
		setChosenPhoto(uri);
	};
	
	// 앨범에 저장된 사진 가져오기
	const getPhotos = async () => {
		const {assets : photos} = await MediaLibrary.getAssetsAsync();		
		setPhotos(photos);
	}	
	
	// 사진 앨범 접근 가능 여부 확인(권한)
	const getPermissions = async() => {
		const {accessPrivileges, canAskAgain} = await MediaLibrary.getPermissionsAsync();
				
		if(accessPrivileges === "none" || accessPrivileges === "undefined" || accessPrivileges === undefined){
			// 권한 부여가 됐는지 그리고 요청을 한번이라도 한적이 있는지 확인	
			const {accessPrivileges} = await MediaLibrary.requestPermissionsAsync();		// 권한 요청 받기
			if(accessPrivileges !== "none"){	// 앨범 사진 로드
				setOk(true);
				getPhotos();
			}
		}else{
			// 이미 요청 받은적이 있음
			setOk(true);
			getPhotos();
		}			
	}
	
	// 사진 선택 후 다음화면으로 넘어가는 버튼
	const HeaderRight = () => (
		<TouchableOpacity onPress={() => 
			navigation.navigate("UploadForm", {
        		file: chosenPhoto,
      		})}>
			<HeaderRightText>다음</HeaderRightText>
		</TouchableOpacity>
	);
	
	// flatlist renderitem
	const renderItem = ({item : photo}) => (
		<TouchableOpacity onPress={() => choosePhoto(photo.uri)} >	
			<Image 
				source = {{uri : photo.uri}}
				style = {{width : width / numColumns, height : 100}}
			/>
			<IconContainer>
				<Ionicons 
					name="checkmark-circle"
					size={18}
					color={photo.uri === chosenPhoto ? "blue" : "white"}
				/>
			</IconContainer>
		</TouchableOpacity>
	)
						
	useEffect(() => {
		getPermissions();		// 앨범 접근 허가 여부 확인
		navigation.setOptions({	// 사진이 선택될때마다 오른쪽버튼 마운트
			headerRight : HeaderRight
		});
	}, [chosenPhoto]);
	
	return (
		<Container>
			<SelectPhotoContainer>
				{chosenPhoto !== "" ? (
				  <Image
					source={{ uri: chosenPhoto }}
					style={{ width, height: "100%" }}
				  />
				) : null}
			</SelectPhotoContainer>
			<SelectListContainer>
				<FlatList
					data = {photos}
					keyExtractor={(photo) => photo.id + ""}
					renderItem={renderItem}
					numColumns={numColumns}
				/>
			</SelectListContainer>
		</Container>
	)
}

