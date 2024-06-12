import { TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

type ButtonProps = {
  title: string
  handlePress: () => void
  containerStyles?: string
  textStyles?: string
  isLoading?: boolean

}
const CustomButton: React.FC<ButtonProps> = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center 
         ${containerStyles}
        ${isLoading ? 'opacity-50' : ''}
        `}
        disabled={isLoading}
        >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
      <StatusBar backgroundColor='#161622' style='light' />
    </TouchableOpacity>
  )
}

export default CustomButton
