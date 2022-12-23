import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from "./screens/SignInScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import SignUpScreen from "./screens/SignUpScreen";
import NewRecordScreen from "./screens/NewRecordScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {

  const [tok, setTok] = useState(null)
  
  const getTok = async () => {
    try{
      const token = await AsyncStorage.getItem('@token')
      setTok(token)
    }
    catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getTok()
  }, [])

  function MainThread() {
    const MainStack = createStackNavigator();
    return (
      <MainStack.Navigator
        screenOptions={{
          presentation: 'card',
        }}
        initialRouteName={tok ? "Dashboard" : "Sign In"}
      >
        <MainStack.Screen name="Sign In" component={SignInScreen} options={{
          headerTitleAlign: 'center',
          headerShown: false
        }} />
        <MainStack.Screen name="Sign Up" component={SignUpScreen} options={{
          headerTitleAlign: 'center',
          headerShown: false
        }} />
        <MainStack.Screen name="Dashboard" component={DashboardScreen} options={{
          headerTitleAlign: 'center',
          headerShown: false
        }} />
        <MainStack.Screen name="Add new Record" component={NewRecordScreen} options={{
          headerTitleAlign: 'center',
          headerShown: false
        }} />
      </MainStack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <MainThread />
    </NavigationContainer>
  );
}

export default App;