import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { RegisterForm } from './RegisterForm'

describe('RegisterForm — acessibilidade WCAG AA', () => {
  it('formulário de cadastro não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('formulário de cadastro com onSubmit não tem violações', async () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterForm onSubmit={() => {}} />
      </MemoryRouter>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
