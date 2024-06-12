import { ScrollView, StyleSheet, Text, View, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginApi } from '../../lib/services/auth.service'
import { initAuthStore } from '../../lib/stores'


const SignIn = () => {
  const[form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit = async () => {
    try{
    await loginApi({email: form.email, password: form.password}).then(async (res) => {
      const response = res.data
      console.log(response) 
      await AsyncStorage.setItem('accessToken', response.data.access_token)
      await AsyncStorage.setItem('refreshToken', response.data.refresh_token)

    })
    await initAuthStore()
  } catch (error) {
    console.log(error)
    Alert.alert('Error', 'Invalid email or password')
  }
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
        <Image 
            source={images.logo}
            resizeMode='contain'
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white font-psemibold mt-10">Log in to Aora</Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyBoardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyBoardType="email-address"
          />
          <CustomButton
          title="Log in"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        />
        <View className="flex-row justify-center pt-5 gap-2">
          <Text className="text-lg text-gray-100 font-pregular">Don't have account?</Text>
          <Link href="/sign-up" className='text-lg font-pregular text-secondary'>Sign up</Link>
          </View>
        </View> 
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn