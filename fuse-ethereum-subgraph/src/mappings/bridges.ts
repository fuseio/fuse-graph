import {
  ForeignBridgeDeployed
} from "../../generated/ForeignBridgeFactory/ForeignBridgeFactory"
import {
  Token as TokenContract
} from "../../generated/templates"
import { ForeignBridgeErcToErc } from "../../generated/schema"

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

  TokenContract.create(event.params._foreignToken)
}

