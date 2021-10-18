# Instaclone Challenge - Nomad Coffee frontend

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