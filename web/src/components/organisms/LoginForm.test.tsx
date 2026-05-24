import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm — acessibilidade WCAG AA', () => {
  it('formulário de login não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('formulário de login com onSubmit não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginForm onSubmit={() => {}} />
      </MemoryRouter>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
