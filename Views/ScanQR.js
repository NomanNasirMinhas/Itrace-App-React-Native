import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Overlay, Avatar } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";

export default function App({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [visible, setVisible] = useState(false);
  const [qrData, setData] = useState("");
  const [spinnerText, setSpinnerText] = useState("Please Wait...");
  const [finished, setFinished] = useState(false);
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [vaccinated, setVaccinated] = useState(false);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [icon, setIcon] = useState("../assets/remove.png");

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setFinished(false);
    // setData(data);
    try {
      var parsedData = JSON.parse(data);
      console.log("parsedData = ", parsedData)
      // setFname(parsedData.FirstName);
      // setSname(parsedData.LastName);
      ///START
      let vaccinationArray = [];
      var vaccineResult = await fetch(`https://itrace-middleware.herokuapp.com/getAllHash/${parsedData.address}&0&VACCINATION`);
      vaccineResult = await vaccineResult.json();
      // console.log("Vaccination Result =", vaccineResult);

      if (vaccineResult != false) {

        for (var i = 0; i < vaccineResult.length; i++) {
          var responseTx = await fetch(`https://itrace-middleware.herokuapp.com/getTx/${vaccineResult[i].toString()}`);
          var resObjTx = await responseTx.json();
          if (resObjTx.response !== false) {
              // console.log(resObjTx.response)
              vaccinationArray.push(resObjTx.response)
          }
      }
      }
      var testArray = [];
      var testResult = await fetch(
        `https://itrace-middleware.herokuapp.com/getAllHash/${parsedData.address}&0&COVIDTEST`
      );
      testResult = await testResult.json();
      // console.log("Tests Result =", testResult);

      if (testResult != false ) {
        if(testResult.length >= 1)
        {for (var i = 0; i < testResult.length; i++) {
          var responseTx = await fetch(`https://itrace-middleware.herokuapp.com/getTx/${testResult[i].toString()}`);
          var resObjTx = await responseTx.json();
          if (resObjTx.response !== false) {
              // console.log(resObjTx.response)
              testArray.push(resObjTx.response)
          }
      }}
        // var last = testArray[0];
        // var status = JSON.parse(last.message);
        // console.log("Status = ", status);

      }
      ///END
      
      setFinished(true);
      navigation.navigate('History', {vaccination: vaccinationArray, test:testArray, info:parsedData.address})
      // alert(JSON.stringify(result));
      // setVisible(true);

    } catch (e) {
      setFinished(true);
      Alert.alert("Error. Please Try Again")
      console.log(e);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          height: 300,
          width: 300,
          backgroundColor: vaccinated ? "#D4EFDF" : "#FADBD8",
        }}
      >
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Avatar
            rounded
            source={require("../assets/vaccine.png")}
            style={styles.image}
          />
          <Text style={[styles.text, { color: "#34495E", fontSize: 25 }]}>
            {fname} {sname}
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontSize: 30,
                color: vaccinated ? "#1E8449" : "#A93226",
                marginBottom: 20,
              },
            ]}
          >
            {vaccinated ? "Vaccinated" : "Not Vaccinated"}
          </Text>
        </View>
      </Overlay>

      <Spinner
        visible={scanned && !finished}
        textStyle={styles.text}
        textContent={spinnerText}
      />

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    alignItems: "center",
    justifyContent: "center",
    margin:'auto',
    paddingTop: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderColor: "#273157",
    zIndex:2
  },
  btnContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
  },

  subtext: {
    // fontFamily: "Metropolis",
    color: "gray",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
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

  image: {
    flex: 0,
    top: 0,
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 50,
  },

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
    marginVertical: 10,
    height: 2,
    width: 300,
    alignSelf: "center",
  },
});
