// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
    address public nftAddress;
    uint public nftID;

    constructor(address _nftAddress, uint256 _nftID) {
        nftAddress = _nftAddress;
        nftID = _nftID;

    }

    // Transfer ownership of property
    function finalizeSale() public {
        // transfer ownership of property

    }

}