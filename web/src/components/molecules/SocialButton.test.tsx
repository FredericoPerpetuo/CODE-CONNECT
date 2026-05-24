import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { SocialButton } from './SocialButton'

describe('SocialButton — acessibilidade WCAG AA', () => {
  it('botão com label e ícone não tem violações', async () => {
    const { container } = render(
      <SocialButton iconSrc="/github.png" label="Github" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('botão Gmail não tem violações', async () => {
    const { container } = render(
      <SocialButton iconSrc="/gmail.png" label="Gmail" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
