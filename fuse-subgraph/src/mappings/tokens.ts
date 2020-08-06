import {
  Transfer as TransferWithData,
  Transfer1 as Transfer,
  TransferManagerSet
} from "../../generated/templates/Token/Token"
import { Token, AccountToken, Account, TransferEvent } from "../../generated/schema"
import { Bytes, BigInt } from '@graphprotocol/graph-ts'
import { log } from '@graphprotocol/graph-ts'


export function updateAccountToken(
  accountAddress: Bytes,
  tokenAddress: Bytes,
  txHash: Bytes,
  blockNumber: BigInt
) : AccountToken {
  let accountd = accountAddress.toHex()
  let account = Account.load(accountd)
  if (account == null) {
    let account = new Account(accountd)
    account.address = accountAddress
    account.save()
  }

  let accountTokenId = tokenAddress.toHexString() + '_' + accountAddress.toHexString()

  let accountToken = AccountToken.load(accountTokenId)
  if (accountToken == null) {
    accountToken = new AccountToken(accountTokenId)
    accountToken.account = accountAddress.toHexString()
    accountToken.tokenAddress = tokenAddress

    accountToken.balance = BigInt.fromI32(0)
    accountToken.txHashes = []
    accountToken.blockNumbers = []
  }
  let txHashes = accountToken.txHashes
  txHashes.push(txHash)
  accountToken.txHashes = txHashes

  let blockNumbers = accountToken.blockNumbers
  blockNumbers.push(blockNumber)
  accountToken.blockNumbers = blockNumbers

  return accountToken as AccountToken
}

function addTransferEvent(event: Transfer): void {
  let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
  let entity = TransferEvent.load(id)
  if (entity == null) {
    entity = new TransferEvent(id)
  }
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp.toI32()
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.tokenAddress = event.address
  entity.save()
}

export function handleTransfer(event: Transfer): void {
  addTransferEvent(event)

  let tokenAddress = event.address
  
  let value = event.params.value
  let fromAccountToken = updateAccountToken(
    event.params.from,
    tokenAddress,
    event.transaction.hash,
    event.block.number
  )
  fromAccountToken.balance = fromAccountToken.balance.minus(value)
  fromAccountToken.save()
  
  let toAccountToken = updateAccountToken(
    event.params.to,
    tokenAddress,
    event.transaction.hash,
    event.block.number
  )

  toAccountToken.balance = toAccountToken.balance.plus(value)
  toAccountToken.save()
}

function addTransferWithData(event: TransferWithData): void {
  let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
  let entity = TransferEvent.load(id)
  if (entity == null) {
    entity = new TransferEvent(id)
  }
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp.toI32()
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.tokenAddress = event.address
  entity.data = event.params.data

  entity.save()
}

export function handleTransferWithData(event: TransferWithData): void {
  addTransferWithData(event)

  let tokenAddress = event.address
  let value = event.params.value
  let fromAccountToken = updateAccountToken(
    event.params.from,
    tokenAddress,
    event.transaction.hash,
    event.block.number
  )
  fromAccountToken.balance = fromAccountToken.balance.minus(value)
  fromAccountToken.save()
  
  let toAccountToken = updateAccountToken(
    event.params.to,
    tokenAddress,
    event.transaction.hash,
    event.block.number
  )

  toAccountToken.balance = toAccountToken.balance.plus(value)
  toAccountToken.save()
}

export function handleTransferManagerSet(event: TransferManagerSet): void {
  // log.info('hahaha {} leon length', [event.address.toHexString()])

  let token = Token.load(event.address.toHexString())
  token.communityAddress = event.params.transferManager
  token.save()
}