"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperContextValue {
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  orientation?: "horizontal" | "vertical"
  isClickable?: boolean
}

const StepperContext = React.createContext<StepperContextValue | undefined>(
  undefined
)

function useStepperContext() {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("useStepperContext must be used within a Stepper")
  }
  return context
}

interface StepperItemContextValue {
  step: number
  isCompleted: boolean
}

const StepperItemContext = React.createContext<
  StepperItemContextValue | undefined
>(undefined)

interface StepperProps {
  activeStep?: number
  orientation?: "horizontal" | "vertical"
  isClickable?: boolean
  children: React.ReactNode
  className?: string
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      activeStep = 1,
      orientation = "horizontal",
      isClickable = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = React.useState(activeStep)

    React.useEffect(() => {
      setCurrentStep(activeStep)
    }, [activeStep])

    return (
      <StepperContext.Provider
        value={{
          activeStep: currentStep,
          setActiveStep: setCurrentStep,
          orientation,
          isClickable,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-col" : "flex-row",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    )
  }
)
Stepper.displayName = "Stepper"

interface StepperItemProps {
  step: number
  completed?: boolean
  children: React.ReactNode
  className?: string
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ step, completed = false, children, className, ...props }, ref) => {
    const { activeStep, setActiveStep, isClickable } = useStepperContext()
    const isActive = activeStep === step
    const isCompleted = completed || activeStep > step

    const handleClick = () => {
      if (isClickable) {
        setActiveStep(step)
      }
    }

    return (
      <StepperItemContext.Provider value={{ step, isCompleted }}>
        <div
          ref={ref}
          className={cn(
            "flex flex-1 flex-col items-center",
            isClickable && "cursor-pointer",
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {children}
        </div>
      </StepperItemContext.Provider>
    )
  }
)
StepperItem.displayName = "StepperItem"

interface StepperTriggerProps {
  children: React.ReactNode
  className?: string
}

const StepperTrigger = React.forwardRef<HTMLDivElement, StepperTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { activeStep } = useStepperContext()
    const stepItem = React.useContext(StepperItemContext)

    if (!stepItem) {
      throw new Error("StepperTrigger must be used within a StepperItem")
    }

    const { step, isCompleted } = stepItem
    const isActive = activeStep === step

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-2",
          isActive
            ? "border-primary bg-primary text-primary-foreground"
            : isCompleted
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground bg-background text-muted-foreground",
          className
        )}
        {...props}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : children}
      </div>
    )
  }
)
StepperTrigger.displayName = "StepperTrigger"

interface StepperContentProps {
  children: React.ReactNode
  className?: string
}

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ children, className, ...props }, ref) => {
    const { activeStep } = useStepperContext()
    const stepItem = React.useContext(StepperItemContext)

    if (!stepItem) {
      throw new Error("StepperContent must be used within a StepperItem")
    }

    const { step } = stepItem
    const isActive = activeStep === step

    if (!isActive) return null

    return (
      <div
        ref={ref}
        className={cn("mt-4 w-full", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepperContent.displayName = "StepperContent"

interface StepperConnectorProps {
  className?: string
}

const StepperConnector = React.forwardRef<HTMLDivElement, StepperConnectorProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useStepperContext()

    return (
      <div
        ref={ref}
        className={cn(
          orientation === "horizontal"
            ? "flex-1 border-t border-muted"
            : "h-8 w-px border-l border-muted",
          "self-center",
          className
        )}
        {...props}
      />
    )
  }
)
StepperConnector.displayName = "StepperConnector"

interface StepperLabelProps {
  children: React.ReactNode
  className?: string
}

const StepperLabel = React.forwardRef<HTMLDivElement, StepperLabelProps>(
  ({ children, className, ...props }, ref) => {
    const { activeStep } = useStepperContext()
    const stepItem = React.useContext(StepperItemContext)

    if (!stepItem) {
      throw new Error("StepperLabel must be used within a StepperItem")
    }

    const { step, isCompleted } = stepItem
    const isActive = activeStep === step

    return (
      <div
        ref={ref}
        className={cn(
          "text-sm font-medium",
          isActive
            ? "text-foreground"
            : isCompleted
            ? "text-foreground"
            : "text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepperLabel.displayName = "StepperLabel"

interface StepperDescriptionProps {
  children: React.ReactNode
  className?: string
}

const StepperDescription = React.forwardRef<
  HTMLDivElement,
  StepperDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
})
StepperDescription.displayName = "StepperDescription"

export {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperContent,
  StepperConnector,
  StepperLabel,
  StepperDescription,
}