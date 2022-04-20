//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions {
    //to keep count of the number of transactions 
    uint256 transactionCount;

    //event to transfer funds with parameter
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    //Structure for the Transfer event
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    //set transaction to TransferStruct array of objects
    TransferStruct[] transaction;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
         transactionCount += 1;
         transaction.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

         emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

     function getAllTransactions() public view returns (TransferStruct[] memory) {
         return transaction;
    }

     function getTransactionCounter() public view returns (uint256) {
         return transactionCount;
    }
}