pragma solidity ^0.5.0;

contract Accident {

    uint public siteCount = 0;

    struct Site{
        uint id;
        string area;
        uint xCoords;
        uint yCoords;
    }
    mapping( uint => Site ) public sites;
    constructor() public {
        siteCount = 0;
    }
    function addSite(string memory _area, uint _x, uint _y) public {
        siteCount ++;
        sites[siteCount] = Site(siteCount, _area, _x, _y);
    }
}