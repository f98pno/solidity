const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Reenterancy', () => {
  let deployer
  let bank

  beforeEach(async () => {
    ;[deployer, user] = await ethers.getSigners()

    const Bank = await ethers.getContractFactory('Bank', deployer)
    bank = await Bank.deploy()

    await bank.deposit({ value: ethers.utils.parseEther('100') })
    await bank.connect(user).deposit({ value: ethers.utils.parseEther('50') })
  })

  describe('Facilitates deposits and withdraws', () => {
    it('Accepts desposits', async () => {
      // Check desposits here
      const deployerBalance = await bank.balanceOf(deployer.address)
      expect(deployerBalance).to.eq(ethers.utils.parseEther('100'))

      const userBalance = await bank.balanceOf(user.address)
      expect(userBalance).to.eq(ethers.utils.parseEther('50'))
    })

    it('Accepts withdraws', async () => {
      await bank.withdraw()

      const deployerBalance = await bank.balanceOf(deployer.address)
      const userBalance = await bank.balanceOf(user.address)

      expect(deployerBalance).to.eq(0)
      expect(userBalance).to.eq(ethers.utils.parseEther('50'))
    })
  })
})
