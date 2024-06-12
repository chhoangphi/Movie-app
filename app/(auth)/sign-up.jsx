import { ScrollView, StyleSheet, Text, View, Image,Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { registerApi } from '../../lib/services/auth.service'

const SignUp = () => {
  const[form, setForm] = useState({
    email: '',
    password: '',
    role: 'USER',
    firstname: 'fdsf',
    lastname: 'sdfs',
    password_confirmation:'123456Aa'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit = async () => {
    if (!form.email || !form.password) {
      return Alert.alert('Error','All fields are required')
    
    }
    setIsSubmitting(true)
    try {
      console.log(form)
      await registerApi(form).then(() => {
        router.push('/sign-in')
      })

    } catch (error) { 
        console.log(error)
    } finally {
      setIsSubmitting(false)
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
          <Text className="text-2xl text-white font-psemibold mt-10">Sign up Aora</Text>
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
          />
          <CustomButton
          title="Sign up"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        />
        <View className="flex-row justify-center pt-5 gap-2">
          <Text className="text-lg text-gray-100 font-pregular">Have account already?</Text>
          <Link href="/sign-in" className='text-lg font-pregular text-secondary'>Sign in</Link>
          </View>
        </View> 
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp