// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var SquareVerifier = artifacts.require('SquareVerifier');
var proof=require("../../zokrates/code/square/proof.json");

contract('TestSolnSquareVerifier', accounts => {   
    describe('setup contracts', function () {
        beforeEach(async function () {   
            verifierContract=await SquareVerifier.new();
            this.contract = await SolnSquareVerifier.new(verifierContract.address, "Udacity Capstone Token", "UCT");
        });

        it('Can add a solution ', async function () {
            let result=await this.contract.addSolution.call(accounts[1], proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
            
            assert.equal(result,true,"Can add a solution");
        });

        it('Can mint token', async function () {
            let result=await this.contract.mintWithProof.call(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs,accounts[1], 1);         
            assert.equal(result,true,"Can mint a token");      
        });
    });
});