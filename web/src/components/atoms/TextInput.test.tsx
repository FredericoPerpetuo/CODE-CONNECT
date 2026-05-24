import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { TextInput } from './TextInput'

describe('TextInput — acessibilidade WCAG AA', () => {
  it('input com label associado não tem violações', async () => {
    const { container } = render(
      <div>
        <label htmlFor="email">Email</label>
        <TextInput id="email" type="email" />
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('input sem label tem violação de label ausente', async () => {
    const { container } = render(<TextInput id="email" type="email" />)
    const results = await axe(container)
    // Esperado: violação — input sem label
    expect(results.violations.length).toBeGreaterThan(0)
  })

  it('input com aria-label não tem violações', async () => {
    const { container } = render(
      <TextInput id="search" type="text" aria-label="Buscar posts" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('input de senha com label associado não tem violações', async () => {
    const { container } = render(
      <div>
        <label htmlFor="senha">Senha</label>
        <TextInput id="senha" type="password" />
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
