import React, {useState, useEffect, useRef} from "react";
import {StatusBar, Alert, Image, View, Text, TouchableOpacity} from "react-native";
import {Camera} from "expo-camera";
import styled from "styled-components/native";
import { useIsFocused } from "@react-navigation/core";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

// 전체 컨테이너
// flex를 1로 해놔야 카메라 보임
const Container = styled.View`
	flex : 1;
	background-color : black;
`;

// 카메라 조작 창
const Actions = styled.View`
	flex : 0.35;
	padding : 0px 50px;
	align-items : center;
	justify-content : space-around;
`;

// 사진 찍기 버튼
const TakePhotoBtn = styled.TouchableOpacity`
	width : 100px;
	height : 100px;
	background-color : rgba(255, 255, 255, 0.5);
	border : 2px solid rgba(255, 255, 255, 0.8);
	border-radius : 50px;
`;

// 버튼 컨테이너 
const ButtonsContainer = styled.View`
	width : 100%;
	flex-direction : row;
	justify-content : space-between;
	align-items : center;
`;

// 슬라이더 컨테이너 
const SliderContainer = styled.View``;

// 카메라 추가 액션컨테이너 
const ActionsContainer = styled.View`
	flex-direction : row;
`;

// 닫기 버튼
const CloseButton = styled.TouchableOpacity`
	position : absolute;
	top : 20px;
	left : 20px;
`;

// 사진 액션 버튼
const PhotoAction = styled.TouchableOpacity`
	background-color : white;
	padding : 10px 25px;
	border-radius : 4px;
`;

// 사진 액션 버튼 안 텍스트
const PhotoActionText = styled.Text`
	font-weight : 600;
`;

export default function TakePhoto({navigation}){
	const camera = useRef();					// 카메라 사용
	const [ok, setOk] = useState(false);	 	// 카메라 권한 확인
	const [cameraType, setCameraType] = useState(Camera.Constants.Type.back); 	// 카메라 전면, 후면 모드
	const [zoom, setZoom] = useState(0);	// 카메라 줌
	const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);	 // 카메라 플래시
	const [cameraReady, setCameraReady] = useState(false);	// 카메라 사용 가능 여부
	const [takenPhoto, setTakenPhoto] = useState("");	 // 사용자가 찍은 사진 uri
	const isFocused = useIsFocused(); // 현재 이 화면을 바라보는지 여부
	
	// 카메라 사용가능으로 변경(카메라 렌더링 완료 후 바로 실행)
	const onCameraReady = () => setCameraReady(true);
	
	// 카메라 권한 확인
	const getPermissions = async() => {
		const {granted} = await Camera.requestPermissionsAsync();
		setOk(granted === true);	// granted가 true인 경우에만 true 설정 
	}
	
	// 카메라 전면 후면 변경
	const onCameraSwitch = () => {
		if(cameraType === Camera.Constants.Type.front){
			setCameraType(Camera.Constants.Type.back);
		}else{
			setCameraType(Camera.Constants.Type.front);
		}
	}
	
	// 카메라 줌 변경 (슬라이더)
	const onZoomValueChange = (e) => {
		setZoom(e);
	}
	
	// 카메라 플래시 모드
	const onFlashChange = () => {
		if(flashMode === Camera.Constants.FlashMode.off){
			setFlashMode(Camera.Constants.FlashMode.on);
		}else if(flashMode === Camera.Constants.FlashMode.on){
			setFlashMode(Camera.Constants.FlashMode.auto);
		}else if(flashMode === Camera.Constants.FlashMode.auto){
			setFlashMode(Camera.Constants.FlashMode.off);
		}
	}
	
	// 카메라 사진 촬영
	const takePhoto = async() => {
		if(camera.current && cameraReady){
			const {uri} = await camera.current.takePictureAsync({
				quality : 1,
				exif : true,
			});
			
			setTakenPhoto(uri);
		}	
	}
	
	// 사진 취소 버튼
	const onDismiss = () => setTakenPhoto("");
	
	// 사진 업로드
	const goToUpload = async (save) => {
		if(save){
			await MediaLibrary.saveToLibraryAsync(takenPhoto);
		}	
		
		navigation.navigation("UploadForm", {
			file : takenPhoto
		});
	}
	
	// 사집 업로드 시 사용자 의견 확인
	const onUpload = () => {
		Alert.alert(
			"사진 업로드",
			"사진을 저장하시겠습니까?",
			[
				{
					text : "업로드",
					onPress : () => goToUpload(true)
				}		
			]
		)	
	};
		
	// useeffect로 권한 확인 호출
	useEffect(() => {
		getPermissions();
	}, [])
	
	// 배터리 정보 등 핸드폰 상단 정보를 사진 찍는 중엔 숨김 처리
	return (		
		<Container>
			{isFocused ? <StatusBar hidden={true} /> : null }			
			
			{takenPhoto === "" ? (
			<Camera
				style = {{flex : 1}}
				type = {cameraType}
				zoom = {zoom}
				flashMode = {flashMode}
				ref = {camera}
				onCameraReady = {onCameraReady}
			>
				<CloseButton onPress={() => navigation.navigate("Tabs")}>
					<Ionicons name="close" color="white" size={30} />	
				</CloseButton>
			</Camera>
			) : (
			<Image 
				source = {{uri : takenPhoto}}
				style = {{flex : 1}}
			/>
			)}
			
			{takenPhoto === "" ? (
				<Actions>
					<SliderContainer>
						<Slider 
							style={{width :200, height : 40}}
							minimumValue={0}
							maximumValue={1}
							minimumTrackTintColor = "#FFFFFF"
							maximumTrackTintColor = "rgba(255, 255, 255, 0.5)"
							onValueChange={onZoomValueChange}
						/>
					</SliderContainer>
					<ButtonsContainer>
						<TakePhotoBtn onPress={takePhoto} />
						<ActionsContainer>
							<TouchableOpacity onPress={onFlashChange}>
								<Ionicons 
									name={
flashMode === Camera.Constants.FlashMode.off ? "flash-off" : flashMode === Camera.Constants.FlashMode.on ? "flash" : flashMode === Camera.Constants.FlashMode.auto ? "eye" : null }
									color="white"
									size={30}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={onCameraSwitch}>
								<Ionicons name={cameraType === Camera.Constants.Type.front ? "camera-reverse" : "camera"}
									color = "white"
									size = {30}
								/>
							</TouchableOpacity>
						</ActionsContainer>
					</ButtonsContainer>
				</Actions>
			) : (
				<Actions>
					<PhotoAction onPress={onDismiss}>
						<PhotoActionText>취소</PhotoActionText>
					</PhotoAction>
					<PhotoAction onPress={onUpload}>
						<PhotoActionText>업로드</PhotoActionText>
					</PhotoAction>
				</Actions>
			)}
		</Container>
	)
}