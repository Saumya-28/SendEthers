import { useState, useEffect } from 'react';
import logo from './logo.svg';
import Web3 from "web3";
import './App.css';
import { loadContract } from './utils/loadContract';
import detectEthereumProvider from '@metamask/detect-provider';
import contract from '@truffle/contract';
// import { web } from 'webpack';

function App() {
  const [web3Api, setWeb3Api] = useState({
    providers: null,
    web3: null,
    contract:null
  });
  const [accounts, setAccounts] = useState(null);
  const [balance,setbalance] = useState(null);
  const [reload,shouldReload] = useState(false);

  const reloadEffect =() => {
    shouldReload(!reload);
  }
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Funder", provider);
      if (provider) {
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        });
      }else {
        console.error("Please install MetaMask!")
      }

      // let provier = null;
      // if (window.ethereum) {
      //   provier = window.ethereum;
      //   try {
      //     await provier.enable();
      //   } catch (error) {
      //     console.log(error);
      //   }
      // } else if (window.web3) {
      //   provier = window.web3.currentProvider;
      // } else if (!process.env.production) {
      //   provier = new Web3.providers.HttpProvider("http://localhost:7545");
      // }
      
    };
    loadProvider();
  }, []);


  useEffect(() => {
    const getBalance = async () => {
      const {contract,web3} = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setbalance(web3.utils.fromWei(balance, "ether"));
    }
    web3Api.contract && getBalance();
  },[web3Api,reload])

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccounts(accounts[0]);
    }
    web3Api.web3 && getAccounts();
  },[web3Api.web3])

  const transferFund = async() => {
    const {web3,contract}=web3Api;
    await contract.transfer({
      from:accounts,
      value:web3.utils.toWei("2","ether"),
    });
    reloadEffect();
  }

  const withdrawFund = async() => {
    const {contract,web3}=web3Api;
    const withdrawFund = web3.utils.toWei("2","ether");
    await contract.Withdraw(withdrawFund,{
      from:accounts,
    });
    reloadEffect();
  }



  console.log(web3Api.web3);

  return (
    <>
      <div class="card text-center">
        <div class="card-header">Funding</div>
        <div class="card-body">
          <h5 class="card-title">Balance: {balance} ETH </h5>
          <p class="card-text">
            Account : {accounts ? accounts : "Not connected"}
          </p>
          <button
            type="button"
            class="btn btn-success"
            onClick={async () => {
              const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              });
              console.log(accounts);
            }}
          >
            Connect to metamask
          </button>
          &nbsp;
          <button type="button" class="btn btn-success " onClick={
            transferFund
          }>
            Transfer
          </button>
          &nbsp;
          <button type="button" class="btn btn-primary " onClick={withdrawFund}>
            Withdraw
          </button>
        </div>
        <div class="card-footer text-muted">Jadu</div>
      </div>
    </>
  );
}

export default App;
