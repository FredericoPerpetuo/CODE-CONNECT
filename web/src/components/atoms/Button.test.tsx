import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'
import { ArrowRightIcon } from './icons'

describe('Button — acessibilidade WCAG AA', () => {
  it('botão com texto não tem violações', async () => {
    const { container } = render(<Button>Entrar</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('botão primário com texto não tem violações', async () => {
    const { container } = render(<Button variant="primary">Cadastrar</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('botão com texto e ícone decorativo não tem violações', async () => {
    const { container } = render(
      <Button variant="primary" icon={<ArrowRightIcon />}>
        Continuar
      </Button>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('botão desabilitado não tem violações', async () => {
    const { container } = render(<Button disabled>Aguarde</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('botão sem texto nem aria-label tem violação de nome acessível', async () => {
    const { container } = render(<Button icon={<ArrowRightIcon />} />)
    const results = await axe(container)
    // Esperado: violação — botão sem nome acessível
    expect(results.violations.length).toBeGreaterThan(0)
  })
})
