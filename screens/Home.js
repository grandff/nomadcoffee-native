import React, {useState, useEffect} from "react";
import { ActivityIndicator, FlatList, Text, View, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import {gql, useQuery} from "@apollo/client";
import { logUserOut } from "../apollo";
import {SHOP_FRAGMENT, USER_FRAGMENT, PHOTO_FRAGMENT, CATEGORY_FRAGMENT} from "../fragments";
import ScreenLayout from "../components/ScreenLayout";
import Shop from "../components/feed/Shop";
import {Ionicons} from "@expo/vector-icons";

// 전체 커피숍 데이터
const HOME_QUERY = gql`
	query seeCoffeeShops($offset : Int!){
		seeCoffeeShops(offset : $offset){
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
`;

export default function Home({navigation}){
	// usequery
	const {data, loading, refetch, fetchMore} = useQuery(HOME_QUERY, {
		variables : {
			offset : 0
		}
	})
	
	// flatlist renderitem
	const renderShop = ({item : shop}) => {
		return <Shop {...shop} />;
	}
	
	// pull to refresh
	const [refreshing, setRefreshing] = useState(false);
	
	// 새로고침
	const refresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	}
	
	// go to photo 
	const PhotoButton = () => (
		<TouchableOpacity style={{marginRight : 25}} onPress={() => navigation.navigate("Upload")}>
			<Ionicons name="camera" color="black" size={20} />
		</TouchableOpacity>
	)
	
	useEffect(() => {
		navigation.setOptions({
			headerRight : PhotoButton
		});
				
		refresh();
	}, []);
	
	return(
		<ScreenLayout loading={loading}>
			<FlatList 
				data = {data?.seeCoffeeShops}
				keyExtractor = {(shop) => shop.id + ""}
				renderItem={renderShop}
				showVerticalScrollIndicator={false}
				style = {{width : "100%"}}
				refreshing={refreshing}
				onRefresh={refresh}
				onEndReachedThreshold={0.02}
				onEndReached={() => fetchMore({
					variables : {
						offset : data?.seeCoffeeShops?.length
					}
				})}
				ItemSeparatorComponent={() => (
						<View
							style= {{
								width : "100%",
								height : 1,
								backgroundColor : "rgba(0, 0, 0, 0.2)",
							}}>
						</View>
				)}		
			/>
		</ScreenLayout>		
	);
}