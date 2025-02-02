import { HTTPException } from 'hono/http-exception'
import { Endpoints } from '../../../../common/constants'
import { useFetch } from '../../../../common/helpers'
import { createArtistPayload } from '../../helpers'
import type { z } from 'zod'
import type { IUseCase } from '../../../../common/types'
import type { ArtistAPIResponseModel, ArtistModel } from '../../models'

export interface GetArtistByLinkArgs {
  token: string
  page: number
  songCount: number
  albumCount: number
  sortBy: 'popularity' | 'latest' | 'alphabetical'
  sortOrder: 'asc' | 'desc'
}

export class GetArtistByLinkUseCase implements IUseCase<GetArtistByLinkArgs, z.infer<typeof ArtistModel>> {
  constructor() {}

  async execute({ token, page, songCount, albumCount, sortBy, sortOrder }: GetArtistByLinkArgs) {
    const response = await useFetch<z.infer<typeof ArtistAPIResponseModel>>(Endpoints.artists.link, {
      token,
      n_song: songCount,
      n_album: albumCount,
      page,
      sort_order: sortOrder,
      category: sortBy,
      type: 'artist'
    })

    if (!response) throw new HTTPException(404, { message: 'artist not found' })

    return createArtistPayload(response)
  }
}
