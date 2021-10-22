# Instaclone Challenge - Nomad Coffee Native

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
	
## 11 Navigation
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
### Login, Register
1) 로그인 화면 구성
	- 로그인 화면은 기존 화면 그대로 구성하기
	- 키보드 열릴때 화면 이동을 위한 dismisskeyboard 기능 추가
	- KeyboardAvoidingView, TouchableWithoutFeedback 등 사용
2) apollo mutation 연결
	- react hook form 설치(yarn add react-hook-form)
	- 로그인 성공 시 profile 화면으로 이동
	
## 작업 일정 정리해보기
1) 로그인 구현
2) 회원가입 구현
3) 메인화면 네비게이션 탭바 구현
4) apollo 연결 --> 여기까지가 아마 챌린지 내용 (14번 Apollo Auth 까지임)
5) 로고 만들기
6) favicon 만들기
7) front 작업 마무리