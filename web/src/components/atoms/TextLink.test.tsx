import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { TextLink } from './TextLink'
import { LoginIcon } from './icons'

describe('TextLink — acessibilidade WCAG AA', () => {
  it('link com texto não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/login">Fazer login</TextLink>
      </MemoryRouter>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('link com texto e ícone decorativo não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/login" icon={<LoginIcon />}>
          Fazer login
        </TextLink>
      </MemoryRouter>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('link sem texto nem aria-label tem violação de nome acessível', async () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink to="/login" icon={<LoginIcon />} />
      </MemoryRouter>,
    )
    const results = await axe(container)
    // Esperado: violação — link sem nome acessível
    expect(results.violations.length).toBeGreaterThan(0)
  })
})
