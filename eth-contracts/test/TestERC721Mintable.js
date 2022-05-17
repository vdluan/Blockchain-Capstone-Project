const truffleAssertions = require("truffle-assertions");

var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const tokenNames=["My Token 1", "My Token 2","My Token 3"];
    const tokenSymbols=["CP1", "CP2","CP3"];
    const tokenIds=[1,2,3];


    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new(tokenNames[0],tokenSymbols[0],{from: accounts[0]});

            //await this.contract.mint(accounts[1],tokenId[0],{from: accounts[0]});
           
             // TODO: mint multiple tokens
            for(var i=0;i<tokenIds.length;i++){                            
                await this.contract.mint(accounts[i+1],tokenIds[i],{from: accounts[0]});
            }
         
        })

        it('should return total supply', async function () { 
            let totalSupply=await this.contract.totalSupply.call({from: accounts[0]});
            assert.equal(totalSupply,tokenIds.length, "Wrong total supply!");
            
        })

        it('should get token balance', async function () {             
            let balance=await this.contract.balanceOf(accounts[1]);
            assert.equal(balance,1, "Wrong balance!");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenId=1;
            let tokenUri=await this.contract.TokenURI.call(tokenId);
            console.log(tokenUri);
            assert.equal(tokenUri,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"+tokenId, "Wrong TokenURI");
        })

        it('should transfer token from one owner to another', async function () { 
            //transfer tokenId 1 from accounts[1] to accounts[2]
            let tokenId=1;
            let owner=await this.contract.ownerOf(tokenId);
            

            await this.contract.transferFrom(owner,accounts[2],tokenId, {from: owner});

            owner=await this.contract.ownerOf(tokenId);
            assert.equal(owner,accounts[2], "Wrong owner!");
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
            await this.contract.mint(accounts[1],4,{from: accounts[1]});
        })
    });

})