import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppHeader from '@/components/global/AppHeader.vue'

describe('AppHeader', () => {
  it('renders properly', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.text()).toContain('App Header')
  })
})
