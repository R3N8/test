import { Hono } from 'hono'
import type { Movie } from '../types/movies'
import { movieList } from '../data/movies.data'

export const movies = new Hono()

// GET /movies with query params
movies.get('/', (c) => {
  let result: Movie[] = [...movieList]

  const minYear = c.req.query('minYear')
  const search = c.req.query('search')
  const genre = c.req.query('genre')
  const maxDuration = c.req.query('maxDuration')

  if (minYear) {
    const y = Number(minYear)
    if (isNaN(y)) return c.json({ error: 'minYear must be a number' }, 400)
    result = result.filter(m => m.year >= y)
  }
  if (search) result = result.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
  if (genre) result = result.filter(m => m.genre === genre)
  if (maxDuration) {
    const d = Number(maxDuration)
    if (isNaN(d)) return c.json({ error: 'maxDuration must be a number' }, 400)
    result = result.filter(m => m.duration <= d)
  }

  return c.json(result)
})

// GET /movies/:id
movies.get('/:id', (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400)

  const movie = movieList.find(m => m.id === id)
  if (!movie) return c.json({ error: 'Movie not found' }, 404)

  return c.json(movie)
})
