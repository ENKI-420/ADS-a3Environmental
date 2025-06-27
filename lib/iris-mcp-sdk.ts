// This is a mock SDK to simulate a command processing system.

// --- TYPE DEFINITIONS ---
type SimpleCommandAction = (params: string[]) => Promise<string>
type ConversationalAction = (data: Record<string, string>) => Promise<string>
type Listener = (state: IrisState) => void

interface SimpleCommand {
  name: string
  keywords: string[]
  action: SimpleCommandAction
}

interface ConversationalStep {
  key: string
  prompt: string
}

interface ConversationalCommand {
  name: string
  keywords: string[]
  steps: ConversationalStep[]
  action: ConversationalAction
}

interface ConversationState {
  commandName: string
  currentStep: number
  collectedData: Record<string, string>
}

export interface IrisState {
  status: "IDLE" | "LISTENING" | "PROCESSING" | "ERROR" | "CONVERSING"
  lastCommand: string | null
  contextInfo: string | null
  conversationState: ConversationState | null
}

// --- IRIS MCP CLASS ---
class IrisMCP {
  private simpleCommands: SimpleCommand[] = []
  private conversationalCommands: ConversationalCommand[] = []
  private listeners: Listener[] = []
  private state: IrisState = {
    status: "IDLE",
    lastCommand: null,
    contextInfo: null,
    conversationState: null,
  }

  // --- REGISTRATION ---
  registerCommand(name: string, keywords: string[], action: SimpleCommandAction) {
    this.simpleCommands.push({ name, keywords, action })
  }

  registerConversationalCommand(
    name: string,
    keywords: string[],
    steps: ConversationalStep[],
    action: ConversationalAction,
  ) {
    this.conversationalCommands.push({ name, keywords, steps, action })
  }

  // --- CORE PROCESSING LOGIC ---
  async process(text: string) {
    this.updateState({ status: "PROCESSING", lastCommand: text })
    const lowerText = text.toLowerCase()

    // If a conversation is active, handle the response
    if (this.state.conversationState) {
      await this.handleConversationResponse(text)
      return
    }

    // Otherwise, look for a new command to start
    for (const command of this.simpleCommands) {
      for (const keyword of command.keywords) {
        if (lowerText.startsWith(keyword)) {
          const params = lowerText.substring(keyword.length).trim().split(" ")
          const contextInfo = await command.action(params)
          this.updateState({ status: "IDLE", contextInfo })
          return
        }
      }
    }

    for (const command of this.conversationalCommands) {
      for (const keyword of command.keywords) {
        if (lowerText.startsWith(keyword)) {
          this.startConversation(command.name)
          return
        }
      }
    }

    this.updateState({ status: "ERROR", contextInfo: "Command not recognized." })
  }

  // --- CONVERSATION HANDLING ---
  private startConversation(commandName: string) {
    const command = this.conversationalCommands.find((c) => c.name === commandName)
    if (!command) return

    const conversationState: ConversationState = {
      commandName,
      currentStep: 0,
      collectedData: {},
    }
    this.updateState({
      status: "CONVERSING",
      conversationState,
      contextInfo: command.steps[0].prompt,
    })
  }

  private async handleConversationResponse(text: string) {
    if (!this.state.conversationState) return

    const { commandName, currentStep, collectedData } = this.state.conversationState
    const command = this.conversationalCommands.find((c) => c.name === commandName)
    if (!command) return

    const step = command.steps[currentStep]
    const newCollectedData = { ...collectedData, [step.key]: text }
    const nextStep = currentStep + 1

    if (nextStep < command.steps.length) {
      this.updateState({
        conversationState: {
          ...this.state.conversationState,
          currentStep: nextStep,
          collectedData: newCollectedData,
        },
        contextInfo: command.steps[nextStep].prompt,
      })
    } else {
      const finalContext = await command.action(newCollectedData)
      this.updateState({
        status: "IDLE",
        conversationState: null,
        lastCommand: "Completed quote request.",
        contextInfo: finalContext,
      })
    }
  }

  // --- STATE MANAGEMENT ---
  updateStatus(status: IrisState["status"]) {
    this.updateState({ status, conversationState: status === "CONVERSING" ? this.state.conversationState : null })
  }

  updateContext(context: string) {
    this.updateState({ contextInfo: context })
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private updateState(newState: Partial<IrisState>) {
    this.state = { ...this.state, ...newState }
    this.notifyListeners()
  }

  getState(): IrisState {
    return this.state
  }
}

export const irisMCP = new IrisMCP()
