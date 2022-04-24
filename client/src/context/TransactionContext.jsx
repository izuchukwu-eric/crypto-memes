import React, {useEffect, useState} from "react";
import {ethers} from 'ethers';

import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

   return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [connectedAccount, setConnectedAccount] = useState("");
    const [formData, setFormData] = useState({addressTo: "", amount: "", keyword: "", message: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}))
    }

    //check if users wallet is connected
    const checkIfWalletIsConnected = async () => {
        try {
            const {ethereum} = window;
            if(!ethereum) return alert("Please install metamask");
    
            const accounts = await ethereum.request({method: "eth_accounts"});
            
            if(accounts.length) {
                setConnectedAccount(accounts[0]);
                
                console.log(accounts[0])
                console.log(connectedAccount);
                //getAllTransactions
            } else {
                console.log("No accounts Found")
            }
            
        } catch (error) {
            console.log(error)

            throw new Error("No ethereum object.")
        }
    }

    //connect users wallet
    const connectWallet = async () => {
        try {
        if(!ethereum) return alert("Please install metamask");

        const accounts = await ethereum.request({method: "eth_requestAccounts"});

        setConnectedAccount(accounts[0]);    
        } catch (error) {
            console.log(error)

            throw new Error("No ethereum object.")
        }
    }


    const sendTransaction = async () => {
        try {
        if(!ethereum) return alert("Please install metamask");

        const {addressTo, amount, keyword, message} = formData;
        const transactionContract = getEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount)

        //request to send transaction
        await ethereum.request({
            method: "eth_sendTransaction",
            params: [{
                from: connectedAccount,
                to: addressTo,
                gas: "0x5208", //2100 GWei
                value: parsedAmount._hex,
            }]
        })

        //to add to blockchain and get the transactionHash
        const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount._hex, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`);

        //get transactionCounter
        const transactionCount = await transactionContract.getTransactionCounter()
        setTransactionCount(transactionCount.toNumber())
            
        } catch (error) {
            console.log(error)

            throw new Error("No ethereum object.")
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    return (
        <TransactionContext.Provider value={{connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    )
}