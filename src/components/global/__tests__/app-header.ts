import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppHeader from '@/components/global/app-header.vue'

describe('app-header', () => {
  it('renders properly', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.text()).toContain('App Header')
  })
})
