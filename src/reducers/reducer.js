const defaultActivePage = 'main'
export function activePage (state, action) {
  switch (action.type) {
    case 'switch_page':
      return action.page
    default:
      return state || defaultActivePage
  }
}

const defaultPages = {}
export function pages (state, action) {
  switch (action.type) {
    case 'start_load':
      return Object.assign({}, state, { [action.page]: { loading: true } })
    case 'finish_load':
      return Object.assign({}, state, {
        [action.page]: { loading: false, data: action.data }
      })
    default:
      return state || defaultPages
  }
}

const defaultBucket = { services: [], items: [], active: false }
export function bucket (state, action) {
  switch (action.type) {
    case 'add_service':
      return Object.assign({}, state, {
        services: state.services.concat(action.service)
      })
    case 'remove_service':
      return Object.assign({}, state, {
        services: state.services.filter(
          service => service.title !== action.service.title
        )
      })
    case 'add_item':
      return Object.assign({}, state, {
        items: state.items.concat(action.item)
      })
    case 'remove_item':
      return Object.assign({}, state, {
        items: state.items.filter(item => item.name !== action.item.name)
      })
    case 'show_bucket':
      return Object.assign({}, state, { active: true })
    case 'hide_bucket':
      return Object.assign({}, state, { active: false })
    case 'buy':
      return defaultBucket
    default:
      return state || defaultBucket
  }
}
