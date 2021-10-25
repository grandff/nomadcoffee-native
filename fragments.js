import {gql} from "@apollo/client";

export const SHOP_FRAGMENT = gql`
	fragment ShopFragment on CoffeeShop {	
		id			
		userId
		name
		caption
		latitude
		longitude			
		createdAt
		updatedAt
	}
`;

export const USER_FRAGMENT = gql`
	fragment UserFragment on User{
		id
		username
		avatarURL
		location
	}
`;

export const PHOTO_FRAGMENT = gql`
	fragment PhotoFragment on CoffeeShopPhoto{
		id
		url
	}
`;

export const CATEGORY_FRAGMENT = gql`
	fragment CategoryFragment on Category{
		id
		category
	}
`;