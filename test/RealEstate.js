const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('RealEstate', () => {
    let realEstate, escrow
    let deployer, seller
    let nftID = 1

    beforeEach(async () => {
        // Setup accounts
        accounts = await ethers.getSigners()
        deployer = await accounts[0]
        seller = deployer

        // Load contracts
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escow = await ethers.getContractFactory('Escrow')
        
        // Deploy contracts
        realEstate = await RealEstate.deploy()
        escrow = await Escow.deploy(
            realEstate.address,
            nftID
        )
    }) 

    describe('Deployment', async () => {
        it('sends an NFT to the seller / deployer', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })

    })

})