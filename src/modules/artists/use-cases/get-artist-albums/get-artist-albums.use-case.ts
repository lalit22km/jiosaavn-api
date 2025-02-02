import { HTTPException } from 'hono/http-exception'
import { Endpoints } from '../../../../common/constants'
import { useFetch } from '../../../../common/helpers'
import { createAlbumPayload } from '../../../albums/helpers'
import type { z } from 'zod'
import type { IUseCase } from '../../../../common/types'
import type { ArtistAlbumAPIResponseModel, ArtistAlbumModel } from '../../models'

export interface GetArtistAlbumsArgs {
  artistId: string
  page: number
  sortBy: 'popularity' | 'latest' | 'alphabetical'
  sortOrder: 'asc' | 'desc'
}

export class GetArtistAlbumsUseCase implements IUseCase<GetArtistAlbumsArgs, z.infer<typeof ArtistAlbumModel>> {
  constructor() {}

  async execute({ artistId, page, sortOrder, sortBy }: GetArtistAlbumsArgs) {
    const response = await useFetch<z.infer<typeof ArtistAlbumAPIResponseModel>>(Endpoints.artists.albums, {
      artistId,
      page,
      sort_order: sortOrder,
      category: sortBy
    })

    if (!response) throw new HTTPException(404, { message: 'artist albums not found' })

    return {
      total: response.topAlbums.total,
      albums: response.topAlbums.albums.map((album) => createAlbumPayload(album))
    }
  }
}
