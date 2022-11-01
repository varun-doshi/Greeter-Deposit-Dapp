// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract Greeter{

    string private greeting;
    
    constructor(string memory _greeting){
        // console.log("Deploying Greeter with Greeting:",_greeting);
        greeting =_greeting;
    }

    function greet() public view returns(string memory){
        return greeting;
    }

    function  setGreeting(string memory _greeting) public {
        // console.log("Changing greeting from '%s' to '%s'",greeting,_greeting);
        greeting=_greeting;
    }

    function deposit() payable public {}

}
