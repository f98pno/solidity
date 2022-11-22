const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('FlashLoan', () => {
  let token, flashLoan, FlashLoanReceiver
  let deployer

  beforeEach(async () => {
    // Setup accounts
    accounts = await ethers.getSigners()
    deployer = accounts[0]

    // Load accounts
    const FlashLoan = await ethers.getContractFactory('FlashLoan')
    const FlashLoanReceiver = await ethers.getContractFactory(
      'FlashLoanReceiver'
    )
    const Token = await ethers.getContractFactory('Token')

    // Deploy Token
    token = await Token.deploy('Test Token', 'TEST', '1000000')

    // Deploy Flash Loan Pool
    flashLoan = await FlashLoan.deploy(token.address)

    // Approve tokesn before depositing
    let transaction = await token
      .connect(deployer)
      .approve(flashLoan.address, tokens(1000000))
    await transaction.wait()

    // Deposits tokens into the pool
    transaction = await flashLoan
      .connect(deployer)
      .depositTokens(tokens(1000000))
    await transaction.wait()

    // Deploy Flash Loan receiver
    flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address)
  })

  describe('Deployment', () => {
    it('Sends tokens to the flash loan pool contract', async () => {
      expect(await token.balanceOf(flashLoan.address)).to.be.equal(
        tokens(1000000)
      )
    })
  })

  describe('Borrowing funds', () => {
    it('Borrow funds from the pool', async () => {
      let amount = tokens(100)
      let transaction = await flashLoanReceiver
        .connect(deployer)
        .executeFlashLoan(amount)
      let result = await transaction.wait()

      await expect(transaction)
        .to.emit(flashLoanReceiver, 'LoanReceived')
        .withArgs(token.address, amount)
    })
  })
})
