import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { Divider } from './Divider'

describe('Divider — acessibilidade WCAG AA', () => {
  it('divider com texto não tem violações', async () => {
    const { container } = render(<Divider>ou entre com outras contas</Divider>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
