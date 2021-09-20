import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Image, StyleSheet } from "react-native";
import { Card, ListItem, Button,Divider } from "react-native-elements";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
// You can then use your `FadeInView` in place of a `View` in your components:
export default ({ route, navigation }) => {
  const { vaccination } = route.params;
  const { test } = route.params;
  const { info } = route.params;

  const [vaccinated, setVaccinated] = useState(false);
  const [tested, setTested] = useState(false);
  const [vaccineResults, setVaccineResult] = useState([]);
  const [testResults, setTestResult] = useState([]);
  const [lastResult, setLastResult] = useState(false);

  useEffect(() => {
    var vaccineResult = vaccination;

    console.log("Vaccination Result =", vaccineResult);

    var testResult = test;

    console.log("Tests Result =", testResult);

    if (vaccineResult.length > 0) {
      setVaccinated(true);
      setVaccineResult(vaccineResult);
    }

    if (testResult.length > 0) {
      setTested(true);
      setTestResult(testResult);
      var last = testResult[testResult.length - 1]
      console.log("JSON Parse 1");
      var status = last
      console.log("Status = ", status)
      setLastResult(status.result)
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
        <View style={{alignItems: 'center'}}>
      <Text style={[styles.text, { fontWeight: "800", fontSize: 14, color:"white" }]}>
        Patients Public ID = {info}
      </Text>

      <Divider style={styles.mainDivider} />
      <Text style={[styles.text, { fontWeight: "800", fontSize: 14, color:tested && !lastResult ?"#229954":"#C0392B" }]}>
        Patient is {tested && !lastResult ? "": "NOT"} Eligible to Donate Plasma
      </Text>
      <Divider style={styles.mainDivider} />

      {vaccinated && (
        <View>
          <Text style={[styles.text, { fontWeight: "500", fontSize: 30, color:"#229954" }]}>
          Patient is Vaccinated
          </Text>
          <Icon
                name="syringe"
                size={50}
                color="#1E8449"
                solid
                style={{ alignSelf:'center'}}
              />
          <Divider style={[styles.subDivider, {backgroundColor:"#229954", opacity:0.8}]} />
          {vaccineResults.map((val, ind)=>{
            // console.log("JSON Parse 2")
            // var data = JSON.parse(val)
            return(<View>
              <Text style={[styles.text, {fontSize: 20, color:"#52BE80" }]}>Vaccinated On {val.date} at {val.location}</Text>
              {/* <Text style={[styles.text, {fontSize: 10, color:"#52BE80" }]}>Address = {val.address}</Text> */}

              <Divider style={styles.subDivider} />
            </View>)
          })}
        </View>
      )}
      <Divider style={styles.mainDivider} />
      {tested && (
        <View>
        <Text style={[styles.text, { fontWeight: "500", fontSize: 30, color:"#229954" }]}>
          Patient has taken COVID Test
        </Text>
        <Text style={[styles.text, { fontWeight: "700", fontSize: 20, color: lastResult ? "#CB4335":"#52BE80" }]}>
          {lastResult ? "Positive":"Negative"} As Per Latest Test
        </Text>
        <Icon
               name={lastResult ? "virus" : "virus-slash"}
                size={50}
                color={lastResult ? "#E74C3C" : "#27AE60"}
                solid
                style={{ alignSelf:'center'}}
              />
        <Divider style={[styles.subDivider, {backgroundColor:"#229954", opacity:0.8}]} />
          {testResults.map((val, ind)=>{
          // console.log("JSON Parse 3");
            var data = (val)
            return(<View>
              <Text style={[styles.text, {fontSize: 20, color: data.result? "#CB4335":"#52BE80" }]}>Tested {data.result ? "Positive" : "Negative"} On {data.date} at {data.location}</Text>
              {/* <Text style={[styles.text, {fontSize: 10, color:"#52BE80" }]}>Address = {val.address}</Text> */}
              <Divider style={styles.subDivider} />
            </View>)
          })}
          </View>
      )}

      {!vaccinated && (
        <View>
        <Text style={[styles.text, { fontWeight: "500", fontSize: 30, color:"#E74C3C" }]}>
          Patient has NOT been Vaccinated YET
        </Text>
        <Icon
                name="syringe"
                size={50}
                color="#CB4335"
                solid
                style={{ alignSelf:'center'}}
              />
        </View>
      )}
      {!tested && (
        <View>
        <Text style={[styles.text, { fontWeight: "500", fontSize: 30, color:"#E74C3C" }]}>
          Patient has NOT taken COVID-19 Test YET
        </Text>
        <Icon
                name="times-circle"
                size={50}
                color="#CB4335"
                solid
                style={{ alignSelf:'center'}}
              />
        </View>
      )}
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    alignItems: "center",
    justifyContent: "center",
    margin:'auto',
    paddingTop: 50,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderColor: "#273157",
    zIndex:2
  },
  button: {
    backgroundColor: "#196F3D",
    color: "white",
    width: 150,
    height:40,
    margin: 5,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "#52BE80",
  },
  btnText:{
    position:'absolute',
    left:20
  },
  text: {
    // fontFamily: "Varela",
    color: "#F0F3F4",
    textAlign: "center",
    fontSize: 20,
  },

  // image: {
  //   flex: 1,
  //   width: undefined,
  //   height: undefined,
  // },
  subDivider: {
    backgroundColor: "gray",
    marginVertical: 10,
    height: 2,
    width: 200,
    alignSelf: "center",
    opacity: 0.1,
  },

  mainDivider: {
    backgroundColor: "gray",
    marginVertical: 30,
    height: 2,
    width: 300,
    alignSelf: "center",
  }
});
