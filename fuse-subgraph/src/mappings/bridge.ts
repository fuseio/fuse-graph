import {
  BridgeMappingUpdated,
} from "../../generated/MainnetBridgeMapper/BridgeMapper"
import { Token as TokenDataSource, HomeBridgeErcToErc as HomeBridgeErcToErcDataSource } from "../../generated/templates"
import { Token as TokenContract} from "../../generated/templates/Token/Token"
import { UserRequestForSignature, CollectedSignatures } from "../../generated/templates/HomeBridgeErcToErc/HomeBridgeErcToErc"
import { BridgeMapping, Token, HomeBridgeErcToErc, CollectedSignaturesEvent, UserRequestForSignatureEvent } from "../../generated/schema"
import { Bytes } from '@graphprotocol/graph-ts'
import { log } from '@graphprotocol/graph-ts'
import { Address } from '@graphprotocol/graph-ts'

export function handleRopstenBridgeMappingUpdated(event: BridgeMappingUpdated): void {
  handleBridgeMappingUpdated(event, 'ropsten')
}

export function handleMainnetBridgeMappingUpdated(event: BridgeMappingUpdated): void {
  handleBridgeMappingUpdated(event, 'mainnet')
}

export function handleBridgeMappingUpdated(event: BridgeMappingUpdated, originNetwork: String): void {

  // log.info('lalala {} leon length', [event.params.homeToken.toHexString()])
  if (event.params.homeToken.toHexString() == '0x0000000000000000000000000000000000000000') {
    return
  }

  let entity = BridgeMapping.load(event.params.key.toHex())

  if (entity == null) {
    entity = new BridgeMapping(event.params.key.toHex())
    TokenDataSource.create(event.params.homeToken)
    HomeBridgeErcToErcDataSource.create(event.params.homeBridge)
  }
  let homeToken = new Token(event.params.homeToken.toHexString()) as Token
  homeToken.address = event.params.homeToken
  
  // let tokenContract = TokenContract.bind(event.params.homeToken)
  
  // homeToken.symbol = tokenContract.symbol()
  // // let callResult = tokenContract.try_symbol()
  // // if (callResult.reverted) {
  // //   log.info("getGravatar reverted", [])
  // //   homeToken.symbol = 'reverted'
  // // } else {
  // //   homeToken.symbol = callResult.value
  // // }

  // // homeToken.symbol = 'LT'
  // // homeToken.name = 'leontest'

  // homeToken.name= tokenContract.name()
  // log.info('totalSupply:', [event.params.homeToken.toHexString()])

  // homeToken.totalSupply = tokenContract.totalSupply()
  // homeToken.decimals = tokenContract.decimals()
  homeToken.originNetwork = originNetwork as string

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
  entity.originNetwork = originNetwork

  // Entities can be written to the store with `.save()`
  entity.save()
}

export function handleUserRequestForSignature(event: UserRequestForSignature): void {
  let key = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
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
  entity.tokenAddress = event.transaction.to as Bytes
  entity.save()

}

export function handleCollectedSignatures(event: CollectedSignatures): void {
  let key = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
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