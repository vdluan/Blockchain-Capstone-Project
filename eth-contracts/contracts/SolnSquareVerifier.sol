pragma solidity >=0.4.21 <0.6.0;
//pragma experimental ABIEncoderV2;

import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";
// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
/*
contract SolutionVerifier is SquareVerifier{
    function verifyTx(
            uint[2] memory a,           
            uint[2][2] memory b,            
            uint[2] memory c,           
            uint[2] memory input
        ) public returns (bool r) {
        Proof memory proof;
        proof.a = Pairing.G1Point(a[0], a[1]);       
        proof.b = Pairing.G2Point(b[0],b[1]);
        proof.c = Pairing.G1Point(c[0], c[1]);
     
        super.verifyTx(proof,input);
    }

}

*/
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token{
    using SafeMath for uint256;
    uint256 index;
    // TODO define a solutions struct that can hold an index & an address
    struct Solution{
        uint index;
        address owner;
        bool isMinted;
    }
    SquareVerifier private verifier;

    constructor(address verifierContractAddress, string memory tokenName, string memory  tokenSymbol ) CustomERC721Token(tokenName, tokenSymbol) public
    {
        verifier= SquareVerifier(verifierContractAddress);
    }
    // TODO define an array of the above struct
    //Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32=> Solution) solutions;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint index, address SolutionAddress);


    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address from, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(bool)
    {
        bytes32 key=_getSolutionKey(a,b,c, input);
        require(solutions[key].index==0,"Solution has been added");
        require(verifier.verifyTx(a, b, c, input), "Cannot verify solution");       
        index.add(1);
        
        solutions[key]=Solution({index: index,
                                owner: from,
                                isMinted: false
                        });
        emit SolutionAdded(index, from);
        return true;

    }



    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintWithProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, address to, uint256 tokenId) public returns(bool){
        bytes32 key=_getSolutionKey(a,b,c, input);
        Solution memory solution=solutions[key];
        if(solution.index==0){  //solution has not been added->add and verify solution
             addSolution(to,a,b,c,input);
        }       
        
        require(!solution.isMinted,"Solution was minted");       
        solution.isMinted=true; 
        super.mint(to, tokenId);
        
        return true;
    }

    function _getSolutionKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) pure internal  returns(bytes32) {
        return keccak256(abi.encodePacked(a,b,c, input));
    }
  

}




























