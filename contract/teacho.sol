//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract Teacho is ERC1155, ERC1155Holder {

    address payable owner;

    constructor() ERC1155("") {
        owner = payable(msg.sender);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    struct Gig {
        address host;
        string title;
        string description;
        string time;
        string meetingId;
        uint flowRate;
        uint stringFlowRate;
        uint gigId;
        uint nftTokenId;
        uint attendees;
    }

    uint public gigId;
    uint public tokenId;

    mapping (uint => Gig) public idToClass;

    uint public maxAttendees = 10;
    

    function createGig(string memory _title, string memory _description, string memory _time, string memory _meetingId, uint _flowRate, uint stringFlowRate) public {
        gigId++;
        tokenId++;
        _mint(address(this), tokenId, maxAttendees, "");
        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "");
        // _mint(msg.sender, tokenId, 1, "");
        idToClass[gigId] = Gig(msg.sender, _title, _description, _time, _meetingId, _flowRate, stringFlowRate, gigId, tokenId, 0);
    }

    function listGigs() public view returns (Gig[] memory){
        uint counter = 0;

        Gig[] memory gigs = new Gig[](gigId);
        for (uint i = 0; i < gigId; i++) {
                uint currentId = i+1;
                Gig storage currentItem = idToClass[currentId];
                gigs[counter] = currentItem;
                counter++;
        }
        return gigs;
    }

    function buy(uint _gigId) public payable {
        Gig memory gig = idToClass[_gigId];
        uint advancePay = (gig.stringFlowRate) * 10/100; // 10% advance pay amount 
        require(msg.value == advancePay, "incorrect advance pay amount");
        require(gig.attendees <= maxAttendees, "max number of users in this gig");
        _safeTransferFrom(address(this), msg.sender, gig.nftTokenId, 1, "");
        gig.attendees++;
        // _mint(msg.sender, gig.nftTokenId, 1, "");
    }

    function myClasses(address _user) public view returns (Gig[] memory){
        uint counter = 0;

        Gig[] memory gigs = new Gig[](gigId);
        for(uint i = 0; i < gigId; i++) {
            uint currentId = i+1;
            if(balanceOf(_user, idToClass[currentId].nftTokenId) > 0) {
                Gig storage currentItem = idToClass[currentId];
                gigs[counter] = currentItem;
                counter++;
            }
        }

        return gigs;
    }
}