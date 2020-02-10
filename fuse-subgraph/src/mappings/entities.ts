import {
  CommunityCreated
} from '../../generated/CommunityFactory/CommunityFactory'
import { Community as CommunityContract } from '../../generated/CommunityFactory/Community'
import { Community, CommunityEntity, EntitiesList } from '../../generated/schema'
import { EntityAdded, EntityRemoved, EntityRolesUpdated } from '../../generated/templates/EntitiesList/EntitiesList'
import { EntitiesList as EntitiesListDataSource } from '../../generated/templates'
import { Address, Bytes } from '@graphprotocol/graph-ts'
import { store } from '@graphprotocol/graph-ts'

export function handleCommunityCreated(event: CommunityCreated): void {
  let community = new Community(event.params.community.toHexString())
  community.address = event.params.community
  community.name = event.params.name
  let communityContract = CommunityContract.bind(event.params.community)
  
  let entitiesListAddress = communityContract.entitiesList()
  let entitiesList = new EntitiesList(entitiesListAddress.toHexString())
  entitiesList.address = entitiesListAddress
  entitiesList.save()

  community.entitiesList = entitiesList.id
  community.save()

  EntitiesListDataSource.create(entitiesList.address as Address)
}


function deriveRoles(entity: CommunityEntity): void {
  let roles = entity.roles
  let mask = new Bytes(1)

  let byteIndex = roles.length - 1
  // user mask
  mask[0] = 1
  if ((roles[byteIndex] & mask[0]) == mask[0]) {
    entity.isUser = true
  } else {
    entity.isUser = false
  }

  // admin mask
  mask[0] = 2
  if ((roles[byteIndex] & mask[0]) == mask[0]) {
    entity.isAdmin = true  
  } else {
    entity.isAdmin = false
  }

  // approved user mask
  mask[0] = 4
  if ((roles[byteIndex] & mask[0]) == mask[0]) {
    entity.isApproved = true  
  } else {
    entity.isApproved = false
  }

    // busineess mask
  mask[0] = 8
  if ((roles[byteIndex] & mask[0]) == mask[0]) {
    entity.isBusiness = true
  } else {
    entity.isBusiness = false
  }

}
export function handleEntityAdded(event: EntityAdded): void {
  let id = event.address.toHexString() + '_' + event.params.account.toHexString()
  let entity = new CommunityEntity(id)
  entity.address = event.params.account
  entity.entitiesList = event.address.toHexString()
  entity.roles = event.params.roles
  entity.createdAt = event.block.timestamp.toI32()

  deriveRoles(entity)

  entity.save()
}


export function handleEntityRemoved(event: EntityRemoved): void {
  let id = event.address.toHexString() + '_' + event.params.account.toHexString()
  store.remove('CommunityEntity', id)
}

export function handleEntityRolesUpdated(event: EntityRolesUpdated): void {
  let id = event.address.toHexString() + '_' + event.params.account.toHexString()

  let entity = CommunityEntity.load(id);
  if (entity) {
    entity.roles = event.params.roles
    deriveRoles(entity as CommunityEntity)
    entity.save()
  }
}

