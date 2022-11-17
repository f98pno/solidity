const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Counter', () => {
    let counter

    beforeEach(async () => {
        const Counter = await ethers.getContractFactory('Counter')
        counter = await Counter.deploy('My Counter', 1)
    })

    describe('Deployment', () => {
        it('Sets the initial count', async () => {    
            expect(await counter.count()).to.equal(1)
        })
    
        it('Sets the initial name', async () => {
            expect(await counter.name()).to.equal('My Counter')
        })
    })

    describe('Counting', () => {
        let transaction

        it('Reads the count from the "count" public variable', async () => {
            expect(await counter.count()).to.equal(1)
        })

        it('Reads the count from the "getCount()" function', async () => {
            expect(await counter.getCount()).to.equal(1)
        })

        it('Increments the count', async () => {
            transaction = await counter.increment()
            await transaction.wait()
            expect(await counter.count()).to.equal(2)

            transaction = await counter.increment()
            await transaction.wait()
            expect(await counter.count()).to.equal(3)
        })

        it('Decraments the count', async () => {
            transaction = await counter.decrement()
            await transaction.wait()
            expect(await counter.count()).to.equal(0)

            // Cannot decrement count below zero
            await expect(counter.decrement()).to.be.reverted
        })

        it('Reads the name from the "name" public variable', async () => {
            expect(await counter.name()).to.equal('My Counter')
        })

        it('Reads the count from the "getName()" function', async () => {
            expect(await counter.getName()).to.equal('My Counter')
        })

        it('Updates the name', async () => {
            transaction = await counter.setName('Hej')
            await transaction.wait()
            expect(await counter.getName()).to.equal('Hej')
        })

    })

})