import { render, screen } from '@testing-library/vue'
import UserAvatar from './UserAvatar.vue'

describe('UserAvatar', () => {
  it('shows the uppercase initial', () => {
    render(UserAvatar, { props: { name: 'budi' } })
    expect(screen.getByText('B')).toHaveClass('h-10')
  })
  it('supports sizes', () => {
    render(UserAvatar, { props: { name: 'sari', size: 'lg' } })
    expect(screen.getByText('S')).toHaveClass('h-24')
  })
})
