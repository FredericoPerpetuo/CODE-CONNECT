import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { Label } from './Label'

describe('Label — acessibilidade WCAG AA', () => {
  it('label com texto não tem violações', async () => {
    const { container } = render(<Label htmlFor="nome">Nome completo</Label>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('label associado a input existente não tem violações', async () => {
    const { container } = render(
      <div>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" />
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
