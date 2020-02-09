import { BigInt } from "@graphprotocol/graph-ts"
import {
  ForeignBridgeDeployed
} from "../generated/ForeignBridgeFactory/ForeignBridgeFactory"
import {
  ForeignBridgeErcToErc as ForeignBridgeErcToErcContract,
} from "../generated/ForeignBridgeFactory/ForeignBridgeErcToErc"
import {
  Transfer as TransferWithData,
  Transfer1 as Transfer
} from "../generated/templates/Token/Token"
import {
  Token as TokenContract
} from "../generated/templates"
import { ForeignBridgeErcToErc, TransferEvent } from "../generated/schema"
import { Address, Bytes } from '@graphprotocol/graph-ts'

export function handleForeignBridgeDeployed(event: ForeignBridgeDeployed): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let foreignBridge = ForeignBridgeErcToErc.load(event.params._foreignBridge.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (foreignBridge == null) {
    foreignBridge = new ForeignBridgeErcToErc(event.params._foreignBridge.toHex())
  }

  // Entity fields can be set based on event parameters
  foreignBridge.address = event.params._foreignBridge

  let bridgeContract = ForeignBridgeErcToErcContract.bind(foreignBridge.address as Address)
  foreignBridge.tokenAddress = bridgeContract.erc20token().toHexString()
  foreignBridge.save()

  TokenContract.create(bridgeContract.erc20token())
}

export function handleTransfer(event: Transfer): void {
  let id = event.transaction.hash.toHexString() + '_' + event.transactionLogIndex.toString() as string
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
  let id = event.transaction.hash.toHexString() + '_' + event.transactionLogIndex.toString() as string
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

// export function handleDeployForeignBridge(call: DeployForeignBridgeCall): void {
//   log.warning('leonn ID: {}',[call.to.toString()])
//   const id = call.to.toHex()
//   let foreignBridge = ForeignBridgeErcToErc.load(id)

//   if (foreignBridge == null) {
//     foreignBridge = new ForeignBridgeErcToErc(id)
//   }
//   foreignBridge.address = call.to
//   foreignBridge.tokenAddress = call.inputs._erc20Token
//   foreignBridge.save()
// }
