import { BigInt } from "@graphprotocol/graph-ts"
import {
  ForeignBridgeDeployed
} from "../generated/ForeignBridgeFactory/ForeignBridgeFactory"
import {
  Transfer as TransferWithData,
  Transfer1 as Transfer
} from "../generated/templates/Token/Token"
import {
  Token as TokenContract
} from "../generated/templates"
import { ForeignBridgeErcToErc, TransferEvent, Token } from "../generated/schema"

export function handleForeignBridgeDeployed(event: ForeignBridgeDeployed): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let foreignBridge = ForeignBridgeErcToErc.load(event.params._foreignBridge.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (foreignBridge == null) {
    foreignBridge = new ForeignBridgeErcToErc(event.params._foreignBridge.toHex())
  }

  foreignBridge.address = event.params._foreignBridge
  foreignBridge.tokenAddress = event.params._foreignToken.toHexString()
  foreignBridge.save()

  let token = Token.load(event.params._foreignToken.toHex())
  if (token == null) {
    token = new Token(event.params._foreignToken.toHex())
    TokenContract.create(event.params._foreignToken)
  }
}

export function handleTransfer(event: Transfer): void {
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

export function handleTransferWithData(event: TransferWithData): void {
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
