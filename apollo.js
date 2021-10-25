import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";

export const isLoggedInVar = makeVar(false);		// 로그인 여부
export const tokenVar = makeVar("");				// 로그인 토큰 값

const TOKEN = "TOKEN";	// 토큰 string

// async stoarge를 사용해서 사용자 로그인 처리
export const logUserIn = async (token) => {
	await AsyncStorage.setItem(TOKEN, token);	// asyncstorage 저장
	isLoggedInVar(true); 						// apollo client var 설정
	tokenVar(token);							// token var 설정
}

// 로그아웃 처리
export const logUserOut = async () => {
	await AsyncStorage.removeItem(TOKEN); 		// asyncstorage 삭제
	isLoggedInVar(false); 						// apollo client var 변경
	tokenVar(null); 							// token var null
}

// 파일을 포함 http link
const uploadHttpLink = createUploadLink({
	uri : process.env.NODE_ENV === "production" ? "https://nomadcoffee-backend-kjm.herokuapp.com/graphql" : "https://instaclone-graphql.run.goorm.io/graphql"
});

// 토큰 정보를 포함한 header
// setcontext 사용
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  }; 
});

// 에러 발생시 확인할 수 있는 링크
const onErrorLink = onError(({ graphQLErros, networkError }) => {
  if (graphQLErros) {
    // graphql error 발생 시
    console.log("GraphQL Error", graphQLErros);
  }

  if (networkError) {
    // network error 발생 시
    console.log("Network Error", networkError);
  }
});

// 모든 http link를 합한 정보
const httpsLink = authLink.concat(onErrorLink).concat(uploadHttpLink);

// merge 처리한 캐시
// cache persist 기능을 구현하기 위해 cache를 expot 처리 해주는 것도
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeCoffeeShops: offsetLimitPagination(),
      },
    },
  },
});

// apollo client
const client = new ApolloClient({
	link : httpsLink,
	cache
});

export default client;