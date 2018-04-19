pragma solidity 0.4.21;

contract Splitter {

    uint private contractBalance;
    mapping(address => uint) private balanceOf;

    address private bob;
    address private carol;
    address private owner;

    event DepositEvent(address from, uint value);
	event WithdrawEvent(address from, uint value);

    function Splitter(address _bob, address _carol) public {
        require(_bob != address(0));
        require(_carol != address(0));

        owner = msg.sender;
        bob = _bob;
        carol = _carol;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getBalance() public view returns (uint) {
        return contractBalance;
    }

    function () public payable {
        require(msg.value > 0);
        require(msg.sender.balance > msg.value);

        uint half = msg.value / 2;

        balanceOf[bob] += half;
        balanceOf[carol] += half;
        balanceOf[owner] += msg.value - (half + half);

        contractBalance = msg.value;

        emit DepositEvent(msg.sender, msg.value);
    }

    function withdraw() public returns (bool) {
        require(balanceOf[msg.sender] != 0);

        uint amount = balanceOf[msg.sender];
        balanceOf[msg.sender] = 0;
        contractBalance -= amount;

        msg.sender.transfer(amount);

        emit WithdrawEvent(msg.sender, amount);
        return true;
    }

    function killMe() public {
        require(msg.sender == owner);
        selfdestruct(msg.sender);
    }
}