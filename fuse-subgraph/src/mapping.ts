import {
  BridgeMappingUpdated,
  EternalOwnershipTransferred
} from "../generated/BridgeMapper/BridgeMapper"
import { Token as TokenContract, HomeBridgeErcToErc as HomeBridgeErcToErcContract } from "../generated/templates"
import { UserRequestForSignature, CollectedSignatures } from "../generated/templates/HomeBridgeErcToErc/HomeBridgeErcToErc"
// import {  } from "../generated/templates/HomeBridgeErcToErc/"
import { BridgeMapping, Token, HomeBridgeErcToErc, CollectedSignaturesEvent, UserRequestForSignatureEvent } from "../generated/schema"
// import { log } from '@graphprotocol/graph-ts'

export function handleBridgeMappingUpdated(event: BridgeMappingUpdated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = BridgeMapping.load(event.params.key.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new BridgeMapping(event.params.key.toHex())
    TokenContract.create(event.params.homeToken)
    HomeBridgeErcToErcContract.create(event.params.homeBridge)
  }

  const homeToken = new Token(event.params.homeToken.toHexString()) as Token
  homeToken.address = event.params.homeToken
  homeToken.save()

  const homeBridge = new HomeBridgeErcToErc(event.params.homeBridge.toHexString())
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



  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let bridgeMapper = BridgeMapper.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - bridgeMapper.getBridgeMapperVersion(...)
  // - bridgeMapper.foreignStartBlockByKey(...)
  // - bridgeMapper.getAddBridgeMappingHash(...)
  // - bridgeMapper.isInitialized(...)
  // - bridgeMapper.foreignBridgeByKey(...)
  // - bridgeMapper.foreignTokenByKey(...)
  // - bridgeMapper.hashedTxs(...)
  // - bridgeMapper.homeBridgeByKey(...)
  // - bridgeMapper.owner(...)
  // - bridgeMapper.initialize(...)
  // - bridgeMapper.homeStartBlockByKey(...)
  // - bridgeMapper.homeTokenByKey(...)
}

export function handleEternalOwnershipTransferred(
  event: EternalOwnershipTransferred
): void {}

// export function handleTransfer(event: Transfer): void {

// }

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