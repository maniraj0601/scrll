import Icon from './Icon.jsx'
import { useFavorites } from '../lib/favorites.js'

// Sits on a card/tile as a one-tap save, like Pinterest/Instagram's bookmark — favouriting
// shouldn't require opening a dialog first.
export default function FavoriteButton({ favKey, label, className = '' }) {
  const { has, toggle } = useFavorites()
  const active = has(favKey)

  return (
    <button
      type="button"
      className={`favorite-button${active ? ' favorite-button--on' : ''}${className ? ` ${className}` : ''}`}
      aria-pressed={active}
      aria-label={active ? `Remove ${label} from favourites` : `Add ${label} to favourites`}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle(favKey)
      }}
    >
      <Icon name="heart" size={16} />
    </button>
  )
}
