import {
  UserRequestForSignature,
  SignedForUserRequest,
  CollectedSignatures,
  AffirmationCompleted
} from "../../generated/HomeBridgeNativeToErc/HomeBridgeNativeToErc"
import { SignedForUserRequestEvent, UserRequestForSignatureEvent, CollectedSignaturesEvent, AffirmationCompletedEvent } from "../../generated/schema"
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

export function handleCollectedSignatures(event: CollectedSignatures): void {
  let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
  let entity = CollectedSignaturesEvent.load(id)
  if (entity == null) {
    entity = new CollectedSignaturesEvent(id)
  }
  entity.address = event.address
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp.toI32()

  entity.authorityResponsibleForRelay = event.params.authorityResponsibleForRelay
  entity.messageHash = event.params.messageHash
  entity.numberOfCollectedSignatures = event.params.NumberOfCollectedSignatures

  entity.save()
}

export function handleAffirmationCompleted(event: AffirmationCompleted): void {
  let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
  let entity = AffirmationCompletedEvent.load(id)
  if (entity == null) {
    entity = new AffirmationCompletedEvent(id)
  }
  entity.address = event.address
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp.toI32()

  entity.recipient = event.params.recipient
  entity.value = event.params.value
  entity.transactionHash = event.params.transactionHash

  entity.save()
}
