import { ScrollView, StyleSheet, Text, View, AppRegistry } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants'
import { Image } from 'react-native'
import CustomButton from '../components/CustomButton'
import { AuthProvider } from '../lib/context/AuthContext'
import { AxiosProvider } from '../lib/context/AxiosContext'

const appConfig = require('../app.json')
const appName = appConfig.expo.name

const Root = () => {
  return (
    <AuthProvider>
      <AxiosProvider>
        <App />
      </AxiosProvider>
    </AuthProvider>
  )
}
AppRegistry.registerComponent(appName, () => Root);

 export default function App () {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle = {{ height: '100%'}}>
        <View className ="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
          source = {images.logo}
          className = "w-[130px] h-p[84px]"
          resizeMode = "contain"
          />
          <Image
          source = {images.cards}
          className = "w-[380px] h-[300px]"
          resizeMode='contain'
          />

          <View className = "relative mt-5">
            <Text className="text-3xl text-white font-bold text-center" >Discover EndLess Possibilities with {' '}
            <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image 
            source = {images.path}
            className = "w-[136px] h-[15px] absolute -bottom-3 -right-9"
            resizeMode='contain'
            />
          </View>
          <Text className="text-sm text-gray-100 mt-5 text-center">When creative sadjsahdjsadbasdsadsad sadfsadasdasdsad sdsadasdsadasd</Text>

          <CustomButton 
            title="Continue with email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
            />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  )
}

