import {
  WalletCreated,
} from "../../generated/WalletFactory/WalletFactory"
import { Wallet } from "../../generated/schema"


export function handleWalletCreated(event: WalletCreated): void {
  let wallet = new Wallet(event.params._wallet.toHexString())
  wallet.blockNumber = event.block.number
  wallet.timestamp = event.block.timestamp.toI32()
  wallet.txHash = event.transaction.hash
  wallet.address = event.params._wallet
  wallet.owner = event.params._owner
  
  wallet.save()
}
