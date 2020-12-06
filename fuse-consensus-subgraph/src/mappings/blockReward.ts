import {
  RewardedOnCycle
} from "../../generated/BlockReward/BlockReward"
import { RewardedOnCycleEvent } from "../../generated/schema"

export function handleRewardedOnCycle(event: RewardedOnCycle): void {
  let id = event.transaction.hash.toHexString() + '_' + event.logIndex.toString() as string
  let entity = RewardedOnCycleEvent.load(id)
  if (entity == null) {
    entity = new RewardedOnCycleEvent(id)
  }
  entity.address = event.address
  entity.txHash = event.transaction.hash
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp.toI32()
  entity.amount = event.params.amount
  entity.save()
}
