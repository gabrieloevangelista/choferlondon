"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStepsProps {
  step: number
}

export function CheckoutSteps({ step }: CheckoutStepsProps) {
  const steps = [
    { id: 1, name: "Dados do Cliente", description: "Informações pessoais" },
    { id: 2, name: "Dados da Viagem", description: "Data, passageiros e bagagem" },
    { id: 3, name: "Pagamento", description: "Finalizar compra" },
  ]

  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((stepItem, stepIdx) => (
            <li key={stepItem.name} className={cn(
              "relative",
              stepIdx !== steps.length - 1 ? 'flex-1' : ''
            )}>
              <div className="flex items-center">
                <div className="relative flex items-center justify-center">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      stepItem.id < step
                        ? 'bg-primary text-white'
                        : stepItem.id === step
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {stepItem.id < step ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{stepItem.id}</span>
                    )}
                  </div>
                </div>
                <div className="ml-4 min-w-0 flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      stepItem.id <= step ? 'text-primary' : 'text-gray-500'
                    )}
                  >
                    {stepItem.name}
                  </span>
                  <span className="text-xs text-gray-500">{stepItem.description}</span>
                </div>
              </div>
              {stepIdx !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-10 h-0.5 w-full",
                    stepItem.id < step ? 'bg-primary' : 'bg-gray-200'
                  )}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}