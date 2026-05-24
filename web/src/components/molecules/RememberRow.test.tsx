import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { RememberRow } from './RememberRow'

describe('RememberRow — acessibilidade WCAG AA', () => {
  it('linha com checkbox e botão não tem violações', async () => {
    const { container } = render(
      <RememberRow checked={false} onCheckedChange={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('checkbox marcado não tem violações', async () => {
    const { container } = render(
      <RememberRow checked={true} onCheckedChange={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
