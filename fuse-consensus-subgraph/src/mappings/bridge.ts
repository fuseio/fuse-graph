import {
  UserRequestForSignature,
  SignedForUserRequest,
  CollectedSignatures
} from "../../generated/HomeBridgeNativeToErc/HomeBridgeNativeToErc"
import { SignedForUserRequestEvent, UserRequestForSignatureEvent, CollectedSignaturesEvent } from "../../generated/schema"
import { log } from '@graphprotocol/graph-ts'

// export function handleRelayedMessage(event: RelayedMessage): void {
//   let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
//   let entity = RelayedMessageEvent.load(id)
//   if (entity == null) {
//     entity = new RelayedMessageEvent(id)
//   }
//   entity.address = event.address
//   entity.txHash = event.transaction.hash
//   entity.blockNumber = event.block.number
//   entity.timestamp = event.block.timestamp.toI32()
//   entity.recipient = event.params.recipient
//   entity.value = event.params.value
//   entity.transactionHash = event.params.transactionHash.toHexString()

//   entity.save()
// }

export function handleSignedForUserRequest(event: SignedForUserRequest): void {
  let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
  let entity = SignedForUserRequestEvent.load(id)
  if (entity == null) {
    entity = new SignedForUserRequestEvent(id)
  }
  entity.address = event.address
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp.toI32()
  entity.signer = event.params.signer
  entity.messageHash = event.params.messageHash

  entity.save()
}

export function handleUserRequestForSignature(event: UserRequestForSignature): void {
  let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
  let entity = UserRequestForSignatureEvent.load(id)
  if (entity == null) {
    entity = new UserRequestForSignatureEvent(id)
  }
  entity.address = event.address
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp.toI32()
  entity.recipient = event.params.recipient
  entity.value = event.params.value

  entity.save()
}

export function handleUserRequestForSignature(event: UserRequestForSignature): void {
  let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
  let entity = UserRequestForSignatureEvent.load(id)
  if (entity == null) {
    entity = new UserRequestForSignatureEvent(id)
  }
  entity.address = event.address
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp.toI32()
  entity.recipient = event.params.recipient
  entity.value = event.params.value

  entity.save()
}

