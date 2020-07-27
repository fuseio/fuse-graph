import {
  InitiateChange,
} from "../../generated/Consensus/Consensus"
import { InitiateChangeEvent } from "../../generated/schema"

export function handleInitiateChange(event: InitiateChange): void {
  let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
  let entity = InitiateChangeEvent.load(id)
  if (entity == null) {
    entity = new InitiateChangeEvent(id)
  }
  entity.address = event.address
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp.toI32()

  entity.parentHash = event.params.parentHash
  entity.save()
}
