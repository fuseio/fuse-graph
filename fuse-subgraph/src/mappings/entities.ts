import {
  CommunityCreated
} from '../../generated/CommunityFactory/CommunityFactory'
import { Community as CommunityContract } from '../../generated/CommunityFactory/Community'
import { Community, CommunityEntity, EntitiesList } from '../../generated/schema'
import { EntityAdded } from '../../generated/templates/EntitiesList/EntitiesList'
import { EntitiesList as EntitiesListDataSource } from '../../generated/templates'
import { Address } from '@graphprotocol/graph-ts'

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

export function handleEntityAdded(event: EntityAdded): void {
  let id = event.address.toHexString() + '_' + event.params.account.toHexString()
  let entity = new CommunityEntity(id)
  entity.address = event.params.account
  entity.entitiesList = event.address
  entity.roles = event.params.roles
  entity.type = 'unkown'
  entity.save()
}
