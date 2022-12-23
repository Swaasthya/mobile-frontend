import axios from "axios";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const storeTok = async (value) => {
    try {
      await AsyncStorage.setItem('@token', value)
    } catch (e) {
      console.error("err saving", e);
    }
  }

  const storeName = async (value) => {
    try {
      await AsyncStorage.setItem('@username', value)
    } catch (e) {
      console.error("err saving", e);
    }
  }

  const signin = async () => {
    await axios.post('http://192.168.29.106:5000/signin', {
      "email": email,
      "password": password
    }).then(response => {
      console.log('here', response.data.user.name);
      storeTok(response.data.token)
      storeName(response.data.user.name)
      navigation.navigate("Dashboard")
    }).catch(err => {
      console.error('error', err.toJSON());
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swaasthya - Sign In</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          keyboardType="email"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>


      <TouchableOpacity style={styles.loginBtn} onPress={() => {
        signin()
      }}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Sign Up");
        }}
      >
        <Text style={styles.forgot_button}>No account yet? Make now!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 130,
    color: 'black',
    fontWeight: 'bold',
  },
  inputView: {
    backgroundColor: "#00A372",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,

    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  forgot_button: {
    height: 30,
    marginTop: 30,
    color: 'green'
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#00A372",
  },
});

export default SignInScreen;