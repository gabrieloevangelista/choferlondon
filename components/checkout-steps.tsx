"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStepsProps {
  step: number
}

export function CheckoutSteps({ step }: CheckoutStepsProps) {
  const steps = [
    { id: 1, name: "Dados do Cliente", description: "Informações pessoais", shortName: "Cliente" },
    { id: 2, name: "Dados da Viagem", description: "Data, passageiros e bagagem", shortName: "Viagem" },
    { id: 3, name: "Pagamento", description: "Finalizar compra", shortName: "Pagamento" },
  ]

  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        {/* Desktop Layout */}
        <ol className="hidden md:flex items-center justify-between">
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

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              {steps.map((stepItem, stepIdx) => (
                <div key={stepItem.name} className="flex items-center">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium",
                      stepItem.id < step
                        ? 'bg-primary text-white'
                        : stepItem.id === step
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {stepItem.id < step ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      stepItem.id
                    )}
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={cn(
                        "w-8 h-0.5 mx-2",
                        stepItem.id < step ? 'bg-primary' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary">
              {steps[step - 1]?.shortName}
            </h3>
            <p className="text-sm text-gray-600">
              {steps[step - 1]?.description}
            </p>
          </div>
        </div>
      </nav>
    </div>
  )
}