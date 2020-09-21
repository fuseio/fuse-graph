
import {
  NewTokenRegistered,
} from "../generated/HomeMultiAMBErc20ToErc677/HomeMultiAMBErc20ToErc677"
import { Token as TokenContract} from "../generated/HomeMultiAMBErc20ToErc677/Token"
import { BridgedToken } from "../generated/schema"

export function handleNewTokenRegistered(event: NewTokenRegistered): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let homeToken = BridgedToken.load(event.params.homeToken.toHex())

  if (homeToken == null) {
    homeToken = new BridgedToken(event.params.homeToken.toHex())
  }

  homeToken.address = event.params.homeToken
  homeToken.foreignAddress = event.params.foreignToken

  let tokenContract = TokenContract.bind(event.params.homeToken)

  homeToken.symbol = tokenContract.symbol()
  homeToken.name= tokenContract.name()
  homeToken.decimals = tokenContract.decimals()

  homeToken.createdAt = event.block.timestamp.toI32()
  homeToken.createdAtBlock = event.block.number

  homeToken.save()
}