# Instaclone Challenge - Nomad Coffee Native
<<<<<<< HEAD

## 11 Setup
### react-natvie
1) npm install --global expo-cli
2) expo init PROJECT_NAME
### goormide 한정 추가 작업
1) devtoolsserver.js 파일 가져와서 수정
	- cp /usr/lib/node_modules/expo-cli/node_modules/\@expo/dev-tools/build/server/DevToolsServer.js /workspace/instaclone_nomad/Nomad_Coffee/nomadcoffee-native/DevToolsServer.js
	- 60번째 라인 const hostname = "instaclone-native.run.goorm.io";
	- 이후 cp /workspace/instaclone_nomad/Nomad_Coffee/nomadcoffee-native/DevToolsServer.js /usr/lib/node_modules/expo-cli/node_modules/\@expo/dev-tools/build/server/DevToolsServer.js
### package 설치
1) expo install expo-app-loading
2) expo install expo-font
3) expo install expo-asset
4) npm install @react-navigation/native
5) expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
6) npm install @react-navigation/stack
### AppLoading
1) 앱 로딩 전 필요한 에셋 로딩을 App.js에 구현
	- AppLoading Component를 활용하고, onError, onFinish, startAsync props 사용
	- preloadAssets function을 통해 폰트, 이미지 등을 promise를 활용해서 로드
	- assets을 포함한 추후 캐시 호출 등 전체 파일 로드를 위한 preload function 추가
	
## 13 Navigation
### tab navigation
1) 기본 화면은 tab navigation으로 구성
	- npm install @react-navigation/bottom-tabs
	- navigator 를 모아놓을 navigators 폴더 생성 후 TabsNav.js 생성
	- 기본적인 화면들 추가(Home, Search, Profile)
### Apollo 연결
1) client 설치
	- npm install @apollo/client
2) apollo.js 생성
	- login 유지를 위한 asyncstoarge 설치(npm install @react-native-async-storage/async-storage)
	- 추후 파일 업로드를 위한 uploader 설치(npm install apollo-upload-client)
	- token, httplink 등을 추가하고 client 생성
3) App.js 작업
	- App.js에서 asset loading 후 navigation 호출 부분을 apollo provider로 감싸주기
	- asset load 후 token 정보를 asyncstoarge에서 호출
	- cache 유지를 위해 apollo3-cache-persist 설치 (npm install apollo3-cache-persist)
4) navigator 설정
	- stack navi 위에 tabs, stacks를 올리는 형태로 구성
	- 공통으로 사용하는 페이지들은 공통 stacks nav에 추가
	- 기본 헤더부분은 로고만  넣기
	- 로그인이 안된 상태면 프로필을 갈때 로그인이 필요하다고 나옴
	- main navs의 mode를 card로 설정했음
### Login
1) 로그인 화면 구성
	- 로그인 화면은 기존 화면 그대로 구성하기
	- 키보드 열릴때 화면 이동을 위한 dismisskeyboard 기능 추가
	- KeyboardAvoidingView, TouchableWithoutFeedback 등 사용
2) apollo mutation 연결
	- react hook form 설치(yarn add react-hook-form)
	- 로그인 성공 시 profile 화면으로 이동

## 14 Home Tab
### Home Tab
1) FlatList를 사용해서 Home 화면 구성
	- 안의 컴포넌트는 별도 파일 생성
	- apollo 연결
	- data, keyextractor, renderitem 필수요소 다시 한번 기억하긔
2) FlatList의 컴포넌트 구현
	- 이름, 사진, 카테고리, 내용이 나오도록
	- usewindowdimension을 통해 기기의 정확한 너비 값 가져와서 설정
3) Loading 표시를 해주는 ScreenLayout component 생성
4) Infinite scroll 구현
	- flatlist의 onendreachedthreshold, onEndReached prop 사용
	- onEndReachedThreshold는 적당히 길이 봐서 설정해주기
5) pull to refresh 구현
	- flatlist의 refreshing, onRefresh prop 사용
	- setRefreshing useState 추가
	- useQuery의 refetch를 불러오는 refresh 함수 추가
6) 구분자 추가
	- ItemSeparatorComponent prop에 view 추가
	
## 15 Search Tab
### search query
1) coffee shop을 검색하도록 search query 추가 (backend)
### DismissKeyboard
1) 빈화면을 누르면 키보드가 사라지도록 레이아웃 추가
	- TouchableWithoutFeedback을 사용해서 터치 이벤트 추가
	- keyboard.dismiss를 통해 키보드 사라짐 효과 추가
	- Platform 변수를 통해 web에선 동작 안하도록 설정
2) Search Tab을 DismissKeyboard로 감싸기
### Search Tab
1) 검색하는 순간 쿼리 실행을 위해 lazy query 사용

	
	
## 추가 기능 구현 목록
### 사진 업로드
### 실시간 대화
### 팔로우, 언팔로우 기능
### 상대방 프로필 조회
=======
>>>>>>> 52bc164d0366f205d02e35fcfce2696ed49f08e3
