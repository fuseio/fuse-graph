import {
  BridgeMappingUpdated,
} from "../../generated/BridgeMapper/BridgeMapper"
import {
  DeployHomeBridgeCall
} from "../../generated/HomeBridgeFactory/HomeBridgeFactory"
import {
  Transfer as TransferWithData,
  Transfer1 as Transfer
} from "../../generated/templates/Token/Token"
import { Token as TokenDataSource, HomeBridgeErcToErc as HomeBridgeErcToErcDataSource } from "../../generated/templates"
import { Token as TokenContract} from "../../generated/templates/Token/Token"
import { UserRequestForSignature, CollectedSignatures } from "../../generated/templates/HomeBridgeErcToErc/HomeBridgeErcToErc"
import { BridgeMapping, Token, HomeBridgeErcToErc, CollectedSignaturesEvent, UserRequestForSignatureEvent } from "../../generated/schema"
import { log } from '@graphprotocol/graph-ts'

export function handleBridgeMappingUpdated(event: BridgeMappingUpdated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = BridgeMapping.load(event.params.key.toHex())
  log.info('Recived event leon: {}', [event.block.number.toString()])

  if (entity == null) {
    entity = new BridgeMapping(event.params.key.toHex())
    TokenDataSource.create(event.params.homeToken)
    HomeBridgeErcToErcDataSource.create(event.params.homeBridge)
  }
  let homeToken = new Token(event.params.homeToken.toHexString()) as Token
  homeToken.address = event.params.homeToken
  
  log.info('Binding token  {}', [event.params.homeToken.toHexString()])
  let tokenContract = TokenContract.bind(event.params.homeToken)
  log.info('Binding token done {}', [event.params.homeToken.toHexString()])
  log.info('hahah', [event.block.number.toString()])
  
  let callResult = tokenContract.try_symbol()
  if (callResult.reverted) {
    log.info('symbol reverted', [])
  } else {
    log.info('Success', [])
    log.info('Token Symbol {}', [callResult.value])
    homeToken.symbol = callResult.value
  }
  homeToken.name= tokenContract.name()
  homeToken.decimals = tokenContract.decimals()


  homeToken.save()

  let homeBridge = new HomeBridgeErcToErc(event.params.homeBridge.toHexString())
  homeBridge.address = event.params.homeBridge
  homeBridge.tokenAddress = event.params.homeToken
  homeBridge.save()

  // Entity fields can be set based on event parameters
  entity.key = event.params.key
  entity.foreignToken = event.params.foreignToken
  entity.homeToken = event.params.homeToken
  entity.foreignBridge = event.params.foreignBridge
  entity.homeBridge = event.params.homeBridge
  entity.foreignStartBlock = event.params.foreignStartBlock
  entity.homeStartBlock = event.params.homeStartBlock
  entity.blockNumber = event.block.number
  entity.txHash = event.transaction.hash

  // Entities can be written to the store with `.save()`
  entity.save()
}

export function handleUserRequestForSignature(event: UserRequestForSignature): void {
  let key = event.transaction.hash.toHexString() + '_' + event.transactionLogIndex.toString() as string
  let entity = UserRequestForSignatureEvent.load(key)

  if (entity == null) {
    entity = new UserRequestForSignatureEvent(key)
  }

  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.recipient = event.params.recipient
  entity.value = event.params.value
  entity.data = event.params.data
  entity.bridgeAddress = event.address
  entity.tokenAddress = event.transaction.to.toHexString()
  entity.save()

}

export function handleCollectedSignatures(event: CollectedSignatures): void {
  let key = event.transaction.hash.toHexString() + '_' + event.transactionLogIndex.toString() as string
  let entity = CollectedSignaturesEvent.load(key)

  if (entity == null) {
    entity = new CollectedSignaturesEvent(key)
  }
  
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.authorityResponsibleForRelay = event.params.authorityResponsibleForRelay
  entity.messageHash = event.params.messageHash
  entity.numberOfCollectedSignatures = event.params.NumberOfCollectedSignatures
  entity.bridgeAddress = event.address

  entity.save()
}

// export function handleTransfer(event: Transfer): void {
//   // const id = event.transaction.hash.toHexString() + '_' + event.transactionLogIndex.toString() as string
//   log.info('handleTransfer', [])
//   let id = 
// }


