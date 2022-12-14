// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;


// an alternative to importing the file. "I" stands for Interface
interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
    address public nftAddress;
    uint256 public nftID;
    uint256 public purchasePrice;
    uint256 public escrowAmount;
    address payable public seller;
    address payable public buyer;
    address public inspector;
    address public lender;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this function");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this function");
        _;
    }

    receive() external payable {}

    bool public inspectionPassed = false;

    mapping(address => bool) public approval;

    constructor(
        address _nftAddress,
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address payable _seller,
        address payable _buyer,
        address _inspector,
        address _lender
        ) {
        nftAddress = _nftAddress;
        nftID = _nftID;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        seller = _seller;
        buyer = _buyer;
        inspector = _inspector;
        lender = _lender;
    }

    //bool public inspectionPassed = false;

    function depositEarnest() public payable onlyBuyer {
        require(msg.value >= escrowAmount);
    }

    function updateInspectionStatus(bool _passed) public onlyInspector{
        inspectionPassed = _passed;
    }

    function approveSale() public {
        approval[msg.sender] = true;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function finalizeSale() public {
        require(inspectionPassed, "Must pass inspection");
        require(approval[buyer], "Buyer need to approve");
        require(approval[seller], "Seller needs to approve");
        require(approval[lender], "Lender needs to approve");
        require(address(this).balance >= purchasePrice, "Must have enougth ETH for sale");
        
        // transfer funds to the seller
        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success);
        
        // transfer ownership of property
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
    }

}