Product Requirements Document (PRD)

Product: Agentic Workflow Platform (codename “Samantha”)
Revision: 1.0 (30 Jun 2025)
Author: –––

⸻

1 Executive Summary

There is a main AI agent we will call Samantha. Users interact with her as a chatbot and she is the main orchestration agent that can call other agents 
including via MCP or A2A. Each user has an AI Twin that keeps a memory of conversations, outputs, documents, etc with each tagged as private, visible 
to their team, or visible to the public.  The primary UI has three screens - the chatbot with Samantha; an Inbox that has any actions that the user 
needs to take (these are created either by Samantha, by requests from other users twins, from inbound emails, or other sources; and a calendar that 
holds the user’s events and can be linked to Google or Outlook calendars.  The system admin can configure the system to connect to various outside 
agents via MCP or A2A. When they do this via the marketplace UI the outside agent provides a manifest that specifies what the agent is capable of 
doing and how to know whether to call it and that specifies any UI screens that the agent may use (such as to ask for user input or render output). 
These up screens are then loaded as Vue templates into the core platform to be available for future use by the agent.  When a user chats with Samantha,
they can ask her to perform any task (eg do consumer research on the optimal price for a new product).  The orchestrator agent then looks at installed 
agents to determine if there is an agent that can fulfill the request. If so, the agent is invoked with the request.  That agent can then request for 
the register Vue UIs to be shown and used to collect or display information to the user.  The orchestrator agent can assign tasks to the user or any 
other user in their team. These tasks show up in the inbox and the agent may schedule time on a users calendar to accomplish the task.  A workflow 
initiated by the orchestrator or sub-agent might span a long duration and can include blocking to wait for human users to pick up and complete tasks 
from their inbox. 

Knowledge‑worker teams need a single interface where an orchestration agent can:

1. Handle conversational requests (“Samantha”).
2. Delegate work to specialist AI agents installed from a marketplace.
3. Track long‑running, human‑in‑the‑loop workflows that surface as Tasks and Calendar events.
4. Store every artefact in a personal AI Twin memory with granular visibility controls.

The goal is to ship an initial SaaS MVP that:
	•	Serves multiple customers (tenants) from one codebase.
	•	Delivers three core screens—Chatbot, Inbox, Calendar—plus an Admin/Marketplace area.
	•	Provides an SDK and manifest format so third‑party agents can be added per tenant.
	•	Persists durable workflows in Temporal Cloud.

Success is measured by:

Metric	Target @ 90 days post‑launch
Active tenants	30
Weekly active users / tenant	≥ 5
Average tasks completed / user / week	≥ 10
Agent installs / tenant	≥ 2
Mean chat latency (P95)	< 600 ms


⸻

2 Personas

Persona	Needs	Pain Points
Knowledge Worker(e.g., PM, analyst)	Ask questions, offload research, track tasks & deadlines	Context switching, manual status updates
Team Lead	Delegate tasks, monitor progress, share outputs within team	Visibility into who’s blocked, duplicative work
Tenant Admin	Configure integrations, manage security, approve marketplace agents	Complex SaaS landscape, data silo concerns
Agent Developer	Distribute an AI micro‑service with minimal front‑end effort	On‑boarding friction, UI consistency


⸻

## 3 High‑Level User Stories

ID	As a …	I want …	So that …
U1	Knowledge Worker	to chat with Samantha in natural language	I can get work done without learning commands
U2	Samantha	to invoke the best agent for a request	the user receives high‑quality results
U3	Knowledge Worker	tasks assigned to me to appear in my Inbox	I never miss follow‑up actions
U4	Knowledge Worker	Samantha to book calendar slots when a task needs focus time	the work is realistically scheduled
U5	Knowledge Worker	anything I produce to be stored in my AI Twin as private by default	I control who sees my data
U6	Team Lead	to mark outputs as team‑visible to specific teams	only relevant colleagues can view
U7	Tenant Admin	to install or disable marketplace agents per tenant	I meet my org’s compliance rules
U8	Agent Developer	to bundle custom Vue forms that load inside the host UI	I gather structured input without rewriting the shell
U9	Knowledge Worker	to search across conversations, tasks, and memory	I quickly reuse past work
U10	Tenant Admin	SSE notifications instead of polling	the front‑end stays real‑time without extra cost


⸻

## 4 Features & Functional Scope

Epic	Key Features	Out of Scope (MVP)
Conversational Hub	GPT‑4o streaming, Markdown & code support, file uploads	Voice, multi‑modal images
Inbox & Tasks	CRUD, due‑date default (+7 days), status updates, SSE pushes	Kanban view
Calendar Sync	Google & Outlook create/update; conflict detection	Delete & recurring events
AI Twin Memory	JSON + embeddings, private/team/public visibility, multi‑team lists	Cross‑tenant sharing
Marketplace	Manifest upload, per‑tenant install/disable, Vue remote loading	Payment, revenue share
Workflow Engine	Temporal Cloud orchestration, task‑blocking, retry policies	Visual workflow designer
Security	Row‑level security in Postgres, JWT auth, RBAC per tenant	SOC‑2 certification in MVP


⸻

## 5 Data Model (logical)

Tenant ─┬─< AppUser ─┬─< UserTeam >─┬─ Team
        │            ├─< Conversation ─┬─< Message
        │            ├─< Task
        │            ├─< CalendarEvent
        │            └─< AIMemory
        ├─< Agent
        └─< WorkflowRun

	•	Visibility enum: private, team, public.
	•	AIMemory.team_ids is array; enforced by RLS policies.
	•	Task.blocking_workflow foreign‑keys the Temporal run to pause/resume.

⸻

## 6 Services & Components

Service	Responsibilities	Stack / Notes
Web UI	React 18 (App‑Router), Tailwind, SSR/ISR	Chatbot, Inbox, Calendar, Admin
Edge Chat API	Stream OpenAI completions	Vercel Edge Functions
Core API	tRPC + REST, all DB writes, SSE feed	Vercel Regional Functions
Orchestrator (Samantha)	Intent routing, agent selection, Temporal triggers	Node 18 + LangChain
Temporal Workers	Durable activities, signals, retries	Run in serverless container on Vercel Cron
Agent Runtime	Reference wrapper for marketplace agents	Separate Vercel project; signed webhook back to Core
Realtime	/api/stream SSE multiplexes tasks & calendar events	Redis‑backed pub/sub


⸻

## 7 External Integrations

Integration	Scope	Auth Flow
OpenAI	Samantha chat & embeddings	Tenant‑wide key (env var)
Google Calendar	Create/update events	OAuth 2 PKCE → refresh in DB
Microsoft Graph	Same as Google	OAuth 2 PKCE
Vercel Blob	File uploads / downloads	Signed URL via server action
Temporal Cloud	Workflow execution	Namespace credentials (env)


⸻

## 8 API Surface (condensed)

### 8.1 Public (browser → Edge/Core)
	•	POST /api/chat → stream (text/event-stream) {role, content}.
	•	GET  /api/stream → SSE events task_update, calendar_update.
	•	POST /api/tasks/:id {status}.
	•	GET  /api/memory/search?q=....
	•	Auth handled by NextAuth session cookie.

### 8.2 Agent Webhooks (external → Core)
	•	POST /api/agent/{agentId}/webhook –– JWT (kid=agentId) in Authorization.
	•	Body shape:

{ "action":"completeTask", "taskId":"...", "payload":{...} }



### 8.3 Internal (Core → Orchestrator → Temporal)
	•	Orchestrator.invokeAgent(manifestId, input)
	•	Temporal.signalTaskDone(workflowId, taskId)

⸻

## 9 Page & Flow Descriptions

Page / Modal	Purpose	Wireframe Highlights
/chat	Main conversation pane, message composer, file drop	Agent‑rendered Vue UI mounts inline
/inbox	Task cards grouped Pending / In‑Progress / Done	Due‑date edit, link to originating workflow
/calendar	Week view (FullCalendar React)	Tasks show as “busy” blocks
/admin/marketplace	List installed agents + “Add Agent” wizard	Manifest upload, status toggle
/settings	Profile, team membership, API keys	Danger zone: delete account

End‑to‑end flow (U1–U4)
	1.	User asks Samantha for consumer price research in /chat.
	2.	Orchestrator picks MarketResearch agent.
	3.	Agent requests extra info → Vue form appears in chat.
	4.	User submits; agent starts workflow in Temporal.
	5.	Workflow creates Review draft Task (Inbox) and tentative 2‑hr Calendar block.
	6.	User completes Task from Inbox; Temporal resumes, agent returns final report; Samantha posts summary and stores doc in AI Twin.

⸻

## 10 Non‑functional Requirements

Category	Requirement
Performance	P95 chat round‑trip < 600 ms
Uptime	99.5 % monthly
Scalability	10 k tenants, 100 k simult. SSE clients
Security	TLS 1.2+, RLS, OWASP Top‑10 audit
Privacy	Data segregated by tenant_id; deletion within 30 days of request
Observability	Structured logs, Temporal tracing, Prometheus metrics exposed


⸻

## 11 Open Questions & Risks
	1.	Marketplace vetting – manual review process not yet defined.
	2.	Cost controls – token usage spikes from poorly written agents.
	3.	Temporal worker hosting – guarantee cold‑start under 3 s on Vercel functions.
	4.	Multi‑LLM agent isolation – per‑agent billing keys, model limits.

⸻

## 12 Timeline (M0 = kick‑off)

Month	Milestone
M0–M1	Core schema, auth, chat MVP
M2	Inbox & Calendar, SSE
M3	Temporal workflows, blocking tasks
M4	Marketplace alpha, first 3 sample agents
M5	Beta launch (pilot tenants)
M6	GA release


⸻

End of PRD
