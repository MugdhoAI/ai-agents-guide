# AI Agents Guide

A practical guide to understanding AI agents, working with coding agents, writing better prompts, and getting more reliable results.

[Open the guide](https://mugdhoai.github.io/ai-agents-guide/)

## What this is

AI agents combine a model with instructions, context, tools, and an execution loop. Instead of only generating text, an agent can inspect information, choose actions, use tools, observe results, and continue until a task is complete.

This repository explains those ideas through practical examples and focused guides. The goal is to understand what is happening under the hood, not just learn another framework.

The live guide currently includes:

* Freebuff
* OpenAI Codex
* Claude Code
* Hermes

Freebuff is the free option covered by the guide. The other sections document separate agents and their own setup, including any required accounts, plans, or providers.

## Start here

If you want a free way to start using AI for coding, begin with the Freebuff guide on the live site. If you already use another agent, choose its guide and follow its own installation and account requirements.

## Core concepts

### Agent fundamentals

The guide covers the building blocks behind agent systems:

* Models and reasoning
* Instructions and context
* Tool use
* Memory
* Planning
* State and execution
* Agent and environment interaction

### The agent loop

A simple agent can be understood as a loop:

```text
Goal
  ↓
Understand the task
  ↓
Choose the next action
  ↓
Use a tool when needed
  ↓
Observe the result
  ↓
Continue or finish
```

Real systems can be much more sophisticated, but the basic idea remains useful.

### Tools

Tools let an agent interact with systems outside the model. Common examples include:

* Web search
* File operations
* APIs
* Databases
* Code execution
* External services

A good agent uses a tool when the tool provides information or an action that the model cannot reliably provide on its own.

### Memory and context

Memory can preserve information across model calls. Context provides the information needed for the current decision.

Both need boundaries. More context is not automatically better, and storing everything does not create useful memory.

### Planning and execution

Some tasks need several actions. Planning helps an agent break a larger goal into manageable steps and execute them in a controlled order.

The amount of planning should match the problem. Simple tasks should stay simple.

## Building an agent

A practical development process is:

1. Define the task.
2. Identify what the model can handle directly.
3. Add only the tools the task actually needs.
4. Define the state the agent must maintain.
5. Build the smallest useful execution loop.
6. Test normal and failure cases.
7. Measure the results.
8. Add complexity only when the evidence justifies it.

## Reliable agent systems

Agents can fail in ways that ordinary software does not. Common failures include incorrect tool selection, invalid arguments, incomplete plans, unexpected tool responses, and wrong assumptions about external state.

Reliable systems need:

* Validation
* Clear tool contracts
* Error handling
* Logging
* Bounded execution
* Failure tests
* Useful observability

The important question is not only whether an agent can complete a task. It is whether you can understand why it succeeded or failed.

## Working with coding agents

The live guide focuses on practical workflows for coding agents:

1. Give the agent the relevant context.
2. State the goal and constraints clearly.
3. Ask for a plan before large changes.
4. Keep the requested change scoped.
5. Review the generated work.
6. Run tests and verify the result.

Small tasks with clear instructions are usually easier to review and safer to execute.

## Learning approach

The goal is to understand the engineering behind agent systems rather than become dependent on a particular framework.

Examples should make it possible to see what the model is doing, why a tool is being called, how state changes, and how the system handles failure.

## Status

This repository is an evolving guide. New material will be added as the tools and practices covered here change.

## License

MIT
