import React, {useEffect, useState} from "react";
import styled from "styled-coomponents/native";
import * as MediaLibrary from "expo-media-library";

// 전체 컨테이너
const Container = styled.View``;

// 선택한 사진 화면
const SelectPhotoContainer = styled.View``;

// 갤러리 목록
const SelectListContainer = styled.View``;

export default function SelectPhoto({route, navigation}){
	const [ok, setOk] = useState(false);					// 사진 설정 확인
	const [photos, setPhotos] = useState([]);				// 사진 목록 배열
	const [chosenPhoto, setChosenPhoto] = useState("");		// 선택한 사진 설정
	
	// 사진 앨범 접근 가능 여부 확인(권한)
	const getPermissions = async() => {
		
	}
	
	// 앨범에 저장된 사진 가져오기
	const getPhotos = async () => {
		
	}			
	
	// 갤러리 접근 허가 여부 확인
	useEffect(() => {
		getPermissions();
	})
	
	return (
		<Container>
			<SelectPhotoContainer>
			
			</SelectPhotoContainer>
			<SelectListContainer>
			
			</SelectListContainer>
		</Container>
	)
}

