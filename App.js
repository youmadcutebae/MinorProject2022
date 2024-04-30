import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import style from './App.module.css';
import { PATIENT_DATA_LIST_ADDRESS, PATIENT_DATA_LIST_ABI } from './contracts/PatientData';
import { SAVE_DATA_LIST_ADDRESS, SAVE_DATA_LIST_ABI } from './contracts/SaveData';
import Add from './routes/Add';
import ShowData from './routes/ShowData';
import CryptoJS from 'crypto-js';
import sendToServerForSecondEncryption from './server/sendToServerForSecondEncryption';

function App() {
  const [web3Instance, setWeb3Instance] = useState(null);
  const [account, setAccount] = useState('');
  const [patientBio, setPatientBio] = useState({
    id: '21CBT1027 ',
    name: 'Aditay Kalia',
    birthDate: '05 Dec 2003',
    phoneNumber: '1234565432',
    _address: 'Chandigrah university ',
  });
  const [patientMedicalData, setPatientMedicalData] = useState({
    medReportId: 'MEDREP' + Math.ceil(Math.random() * 1000000000),
    weight: '158',
    height: '164',
    bloodGroup: 'B+',
    diseaseName: 'Hyper Myopia',
    diseaseDescription: 'caused by long exposure to harmful artificial blue light',
    diseaseStartedOn: '1 apr 2016',
  });
  const [patientBioMedList, setPatientBioMedList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const network = await web3.eth.net.getNetworkType();
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      console.log(accounts[0]);

      const patientDataContract = new web3.eth.Contract(PATIENT_DATA_LIST_ABI, PATIENT_DATA_LIST_ADDRESS);
      const saveDataContract = new web3.eth.Contract(SAVE_DATA_LIST_ABI, SAVE_DATA_LIST_ADDRESS);

      setWeb3Instance(web3);
    }

    fetchData();
  }, []);

  const addUpdatePatientMedicalData = () => {
    console.log(patientBio, patientMedicalData);
    const JSONStringData = JSON.stringify({ patientBio, patientMedicalData });
    const hash = CryptoJS.SHA256(JSONStringData).toString(CryptoJS.enc.Hex);
    const firstCiphertext = CryptoJS.AES.encrypt(JSONStringData, hash).toString();
    const secondCiphertext = sendToServerForSecondEncryption.encryptFirstCipherText(
      firstCiphertext,
      account,
      patientMedicalData.medReportId
    );

    // Check if web3Instance is not null before creating the saveDataContract instance
    if (web3Instance) {
      const saveDataContract = new web3Instance.eth.Contract(SAVE_DATA_LIST_ABI, SAVE_DATA_LIST_ADDRESS);

      saveDataContract.methods
        .saveData(secondCiphertext, hash, patientMedicalData.medReportId)
        .send({ from: account })
        .once('receipt', (receipt) => {
          console.log('saved', receipt);
          setPatientMedicalData({
            ...patientMedicalData,
            medReportId: 'MEDREP' + Math.ceil(Math.random() * 1000000000),
          });
        });
    } else {
      console.error('Web3 instance is not initialized');
    }
  };

  return (
    <Container maxWidth="md" className={style.container}>
      <Add
        patientBio={patientBio}
        setPatientBio={setPatientBio}
        patientMedicalData={patientMedicalData}
        setPatientMedicalData={setPatientMedicalData}
        addUpdatePatientMedicalData={addUpdatePatientMedicalData}
      />
      <ShowData patientBioMedList={patientBioMedList} />
    </Container>
  );
}

export default App;