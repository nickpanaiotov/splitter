pragma solidity ^0.4.19;

contract Splitter {

    // Comment: If this variable is public we would not need to write a getBalance function -
    // all public variables have autocreated get function see: http://solidity.readthedocs.io/en/develop/contracts.html#getter-functions
    uint private balance;
    
    // Comment: For better understanding this could be named something like balanceOf
    mapping(address => uint) private particepents;

    address private bob;
    address private carol;

    // Comment: Events for the functions can be added here, they are a good practice when creating smart contracts 

    // Comment: Owner of the contract needs to be set in the construct
    function Splitter(address _bob, address _carol) public {
    // Comment: What will happen if _bob or _carol are null, or both? Consider validating input parameters
        bob = _bob;
        carol = _carol;
    }

    function getBalance() public view returns (uint) {
        return balance;
    }

    // Comment:  Not sure if that is needed
    function isParticipating(address particepent) public view returns (bool) {
        return (bob == particepent || carol == particepent);
    }

    // Comment: Here you can add a remainder if the msg.value is not even, this can be stored into the owner's balance.
    // Comment: You can make this like a fallback function, so we could send ETH directly to the contract and not using a function call
    function split() public payable returns (bool success) {
        require(msg.value > 0);
        require(msg.sender.balance > msg.value);

        uint half = msg.value / 2;
        particepents[bob] += half;
        particepents[carol] += half;

        balance += (half + half);

        return true;
    }

    function withdraw() public returns (bool) {
        require(particepents[msg.sender] != 0);

        uint amount = particepents[msg.sender];
        particepents[msg.sender] = 0;
        balance -= amount;

        msg.sender.transfer(amount);

        return true;
    }
    
    //Comment: You can add a kill switch here for the contract
}
