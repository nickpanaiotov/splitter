pragma solidity ^0.4.19;

contract Splitter {

    uint private balance;
    mapping(address => uint) private particepents;

    address private bob;
    address private carol;


    function Splitter(address _bob, address _carol) public {
        bob = _bob;
        carol = _carol;
    }

    function getBalance() public view returns (uint) {
        return balance;
    }

    function isParticipating(address particepent) public view returns (bool) {
        return (bob == particepent || carol == particepent);
    }

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
}