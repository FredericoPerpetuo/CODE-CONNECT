import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { SocialLoginGroup } from './SocialLoginGroup'

describe('SocialLoginGroup — acessibilidade WCAG AA', () => {
  it('grupo de botões sociais não tem violações', async () => {
    const { container } = render(<SocialLoginGroup />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
