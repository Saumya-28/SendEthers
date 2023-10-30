// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.14 ;

contract Funder{
    uint public numberofFunders;
    mapping(uint => address) private funders;
    receive() external payable{}
    function transfer() external payable {
        funders[numberofFunders] = msg.sender;
    }
    function Withdraw(uint withdrawAmount) external {
        require(
            withdrawAmount <= 2000000000000000000,
            "Cannot withdraw more than 2 ether"
        );
        payable(msg.sender).transfer(withdrawAmount);
    }

}

