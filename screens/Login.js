import React, { useRef, useEffect } from "react";
import {TouchableOpacity, View, Text} from "react-native";
import styled from "styled-components/native";
import AuthLayout from "../components/auth/AuthLayout";
import {TextInput} from "../components/auth/AuthShared";
import AuthButton from "../components/auth/AuthButton";
import {gql, useMutation} from "@apollo/client";
import {useForm} from "react-hook-form";
import {logUserIn} from "../apollo";

// 로그인 mutation
const LOGIN_MUTATION = gql`
	mutation login($username : String!, $password : String!){
		login(username : $username, password : $password){
			ok
			token
			error
		}
	}
`;

// 회원가입 시 아이디, 비밀번호를 route를 통해 받아옴
export default function Login({navigation, route : {params}}){	
	const passwordRef = useRef();
	// 다음칸으로 이동
	const onNext = (nextOne) => {
		nextOne?.current?.focus();
	}
	
	// react-hook-form
	const {register, handleSubmit, setValue, watch} = useForm({
		defaultValues : {
			// null check
			username : params?.username,
			password : params?.password
		}
	});
	
	// 로그인 mutation 실행 후 
	const onCompleted = async (data) => {
		const {login : {ok, error, token}} = data;
		if(ok){
			await logUserIn(token);
			navigation.navigate("Profile");
		}else{
			alert(error);
		}
	}
	
	// login mutation
	const [logInMutation, {loading}] = useMutation(LOGIN_MUTATION, {onCompleted});
	
	// submit valid
	const onValid = (data) => {
		if(!loading) {
			logInMutation({
				variables : {
					...data
				}
			})
		}
	}
	
	// register 등록
	useEffect(() => {
		register("username", {
			required : true
		});
		
		register("password", {
			required : true
		});
	}, [register])
	
	return(
		<AuthLayout>
			<TextInput 
				placeholder = "아이디"	
				returnKeyType = "next"
				placeholderTextColor={"rgba(0,0,0,0.6)"}
				onSubmitEditing={() => onNext(passwordRef)}
				onChangeText={(text) => setValue("username", text)}
				autoCapitalize = "none"
				value={watch("username")}
			/>
			<TextInput
				ref={passwordRef}
				placeholder="비밀번호"
				secureTextEntry
				returnKeyType="done"
				placeholderTextColor={"rgba(0,0,0,0.6)"}
				onSubmitEditing={handleSubmit(onValid)}
				onChangeText={(text) => setValue("password", text)}
				value={watch("password")}
			/>
			<AuthButton
				text="로그인"	
				loading={loading}
				onPress={handleSubmit(onValid)}
				disabled={!watch("username") || !watch("password")}
			/>
		</AuthLayout>
	);
}