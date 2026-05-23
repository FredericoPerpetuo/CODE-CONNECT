import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { FormField } from './FormField'

describe('FormField — acessibilidade WCAG AA', () => {
  it('campo de texto com label não tem violações', async () => {
    const { container } = render(
      <FormField id="nome" label="Nome completo" type="text" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('campo de email com label não tem violações', async () => {
    const { container } = render(
      <FormField id="email" label="Email" type="email" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('campo de senha com label não tem violações', async () => {
    const { container } = render(
      <FormField id="senha" label="Senha" type="password" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
