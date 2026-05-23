import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox — acessibilidade WCAG AA', () => {
  it('checkbox com label associado não tem violações', async () => {
    const { container } = render(
      <Checkbox id="lembrar" label="Lembrar-me" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('checkbox marcado não tem violações', async () => {
    const { container } = render(
      <Checkbox id="lembrar" label="Lembrar-me" defaultChecked />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('checkbox desabilitado não tem violações', async () => {
    const { container } = render(
      <Checkbox id="lembrar" label="Lembrar-me" disabled />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
