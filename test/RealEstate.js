const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('RealEstate', () => {
  let realEstate, escrow
  let deployer, seller
  let nftID = 1
  let purchasePrice = ether(100)
  let escrowAmount = ether(100)

  beforeEach(async () => {
    // Setup accounts
    accounts = await ethers.getSigners()
    deployer = await accounts[0]
    seller = deployer
    buyer = accounts[1]
    inspector = accounts[2]
    lender = accounts[3]

    // Load contracts
    const RealEstate = await ethers.getContractFactory('RealEstate')
    const Escow = await ethers.getContractFactory('Escrow')

    // Deploy contracts
    realEstate = await RealEstate.deploy()
    escrow = await Escow.deploy(
        realEstate.address,
        nftID,
        purchasePrice,
        escrowAmount,
        seller.address,
        buyer.address,
        inspector.address,
        lender.address,
        )

    // Seller Approves NFT
    transaction = await realEstate.connect(seller).approve(escrow.address, nftID)
    await transaction.wait()

  })

  describe('Deployment', async () => {
    it('sends an NFT to the seller / deployer', async () => {
      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
    })
  })

  describe('Selling real estate', async () => {
    let balance, transaction

    it('Executes a successful transaction', async () => {
      // Expects seller to be NFT owner before the sale
      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)

      // Buyer deposit earnest
      transaction = await escrow.connect(buyer).depositEarnest({value: escrowAmount})

      // Check escrow balance
      balance = await escrow.getBalance()
      console.log("escrow balance:", ethers.utils.formatEther(balance))

      // Finalize sale
      transaction = await escrow.connect(buyer).finalizeSale()
      await transaction.wait()
      console.log('Buyer finalize sale')

      // Expects buyer to be NFT owner after the sale
      expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)

    })

  })
})
