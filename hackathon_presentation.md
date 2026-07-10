# Obsidian – 15 Minute Hackathon Presentation Kit

## 1. One-line pitch
Obsidian is an AI governance and cost-audit platform that acts like a safety layer and control panel for LLM-powered agents. It enforces budgets, blocks risky requests, logs every decision, and automatically optimizes routing to cheaper models.

---

## 2. The Hook (Emotional Touch)
*Imagine this: It’s 3 AM. You’re a startup founder or an engineering lead who just deployed an exciting new AI agent. Your phone buzzes with an alert—a single bug caused your agents to get stuck in an endless loop. In just 4 hours, they burned through $15,000 of your company's runway. Or worse, a customer tricked your AI into leaking sensitive user data onto the internet. Your dream launch just became a nightmare.*

*When you build software, you have error tracking, rate limits, and firewalls. But when you build AI, you hand over a credit card to an unpredictable black box. What if you had a seatbelt for your AI? A system that never sleeps, never exceeds budget, and never leaks data?*
   /
---

## 3. Problem statement
Modern AI apps can easily overspend, leak sensitive data, and produce ungoverned decisions because there is no real-time control layer between the user and the model.

Pain points:
- Unexpected LLM bills (infinite loops or over-querying expensive models)
- No visibility into model usage and decision history
- Sensitive data reaching the wrong model
- No automatic optimization when a category becomes too expensive

Obsidian solves this with one unified system.

---

## 4. The Impact
Without a governance layer, the impact is devastating. Companies either delay AI adoption out of fear of non-compliance, or they deploy blindly and face catastrophic financial and reputational damage. The impact of unmanaged AI is lost runway, lost consumer trust, and failed compliance audits. Obsidian removes this fear, unlocking enterprise AI adoption at scale.

---

## 5. What Obsidian does
Obsidian provides:
- Budget enforcement
- Policy-based routing
- Cost audit logging
- Compliance guardrails
- Automated optimization suggestions
- A beautiful real-time dashboard

---

## 6. Core idea
Every user query goes through a governed workflow:
1. The query is classified into a category
2. The routing policy decides which model to use
3. Cascadeflow enforces budget and governance rules
4. The request is sent to Groq-hosted LLMs
5. The decision is logged with cost, latency, and action
6. Insights are generated to suggest cheaper routing

---

## 7. Architecture & Tech stack
### Backend
- **FastAPI / Python**: Exposes endpoints (/query, /events, /insights, /session). Fast to build and ideal for AI and backend automation.
- **Uvicorn**: ASGI server running the FastAPI application efficiently.
- **Groq API**: High-speed LLM inference models via the OpenAI SDK.
- **Cascadeflow**: The governance engine enforcing budgets and policies.
- **Hindsight**: Memory and insight layer detecting recurring costly patterns.

### Frontend
- **Next.js & React**: Provides a polished dashboard, live system state, and interactive components.
- **TypeScript & Tailwind CSS**: Ensures type safety and rapid, modern, responsive UI styling.
- **Stunning UI/UX**: Dynamic Light/Dark mode toggle that shifts the aesthetic instantly.
- **Premium Auth Flow**: Seamless Login/Signup interface that guards the cockpit.
- **Interactive Visuals**: WebGL Ferrofluid animations and Framer Motion for a premium feel.
- **Live Analytics**: Real-time Recharts tracking spend, latency, and query patterns.

### Data flow
User → Frontend → Backend API → Category classifier → Routing policy → Groq model → Audit logger → Dashboard / insights

---

## 8. Main features
### Budget enforcement
The system uses a session budget (default $1.00 / ₹0.02 demo cap) and blocks or stops requests when the budget is exceeded.

### Compliance guardrails
Sensitive categories are protected from automatic downgrade and remain governed.

### Intelligent routing
Routine queries can be rerouted to a cheaper model without harming quality.

### Audit trail
Every request is saved with timestamps, category, model, cost, latency, and action.

### Hindsight insights
The system can store and reason over past events to detect escalation patterns.

---

## 9. How Obsidian Generates Revenue (Business Model)
Obsidian isn't just a safety tool; it's a massive B2B business opportunity. We can monetize through:
1. **Usage-Based SaaS Tier**: Charge a fraction of a cent (e.g., $0.001) for every AI request governed and routed by Obsidian.
2. **Gain-Share Optimization**: Our Hindsight engine automatically suggests cheaper models for routine tasks. If we save a company $10,000 a month on LLM costs, we take a 10% cut of the savings.
3. **Enterprise Licensing**: Fixed monthly fees for on-premise deployments, custom RBAC (Role-Based Access Control), and specialized compliance policies (SOC2/HIPAA).
4. **Premium Analytics**: Upselling advanced historical data retention and team-level budget forecasting.

---

## 10. AI models used
### Primary model
- llama-3.3-70b-versatile
- Used as the default premium model for general higher-quality responses

### Cheaper fallback model
- llama-3.1-8b-instant
- Used for lower-cost routing when the category is routine and budget-sensitive

### Why these models
- Fast inference
- Low-cost compared to larger models
- Good enough for customer-support-like tasks
- Accessible via Groq API

### Important note
The system is model-agnostic. It can be switched to other OpenAI-compatible models easily.

---

## 11. How the backend works internally
### Query classification
The input is classified into one of four categories:
- order_status
- refund
- sensitive_data
- general_faq

### Route selection
The routing policy chooses a model per category.

### Budget enforcement
Cascadeflow checks the accumulated cost before each run and stops if the budget is exhausted.

### Logging and insights
Each request is recorded and later used to generate alerts and route optimization suggestions.

---

## 12. Why this is a strong hackathon project
It is not just a demo. It solves a real product problem:
- AI governance
- Cost control
- Safety compliance
- Enterprise readiness

It combines:
- AI
- Backend engineering
- Full-stack UI
- Real-world product thinking

That is what judges love.

---

## 13. Demo flow for 15-minute presentation
### 0:00 – 0:02 | Hook
Tell the story of the $15k overnight bill. *"What if your AI agent could never exceed budget, never leak sensitive data, and always learn how to become cheaper?"*

### 0:02 – 0:05 | Problem & Impact
Show the pain points: rising AI costs, lack of governance, no audit visibility, and the fear holding enterprises back.

### 0:05 – 0:09 | Solution & Demo
Introduce Obsidian as the control layer. Show the premium landing page with Light/Dark mode and WebGL visuals. Walk through Auth, open the dashboard, submit a query, and show budget blocking/insights in real time.

### 0:09 – 0:12 | Tech stack & Revenue
Explain the stack, the models, and pitch the 4-tier business model (Usage, Gain-Share, Enterprise, Premium Analytics).

### 0:12 – 0:14 | Impact / closing
*"Obsidian turns AI from a risky, opaque black box into a governed, measurable, and cost-aware system. We are the seatbelt for the AI generation."*

---

## 14. Short pitch script
"We built Obsidian, an AI governance layer for LLM agents. Today, businesses use AI without real cost or safety controls. Obsidian gives every request a budget, a compliance policy, and a visibility dashboard. It classifies queries, routes them to the right model, blocks overspending, logs each event, and even suggests cheaper routing strategies over time. Our stack uses FastAPI, Next.js, Groq, Cascadeflow, and Hindsight. With our usage-based and gain-share revenue models, this makes AI agents safer, cheaper, and far more production-ready."

---

## 15. Possible hackathon questions and strong answers
### Q1. What problem are you solving?
A: We are solving the lack of governance for AI agents. Teams often deploy LLM-based apps without budget controls, risk policies, or visibility into what is happening behind each query.

### Q2. Why is this important?
A: Because AI usage can become expensive and unsafe very fast. Enterprises need cost control, compliance, and auditability.

### Q3. How does your system work?
A: It classifies the query, applies routing policy, enforces budgets using Cascadeflow, calls the chosen model, logs the event, and generates optimization insights.

### Q4. What makes your solution unique?
A: It is not just a chatbot. It is a governance and optimization layer that sits in front of AI agents and makes them controllable.

### Q5. What models are you using?
A: We use Groq-hosted Llama 3.3 70B for quality and Llama 3.1 8B for cheaper fallback. The architecture is model-agnostic, so it can support more models later.

### Q6. How do you handle sensitive data?
A: Sensitive categories are explicitly governed and not automatically downgraded, which prevents unsafe routing.

### Q7. What happens if the budget is exceeded?
A: The request is blocked or stopped by the enforce mode and the event is logged.

### Q8. How did you build the dashboard?
A: We used Next.js and React with charts for spend, latency, categories, and recent events. We also added dynamic themes and secure auth.

### Q9. What is the biggest technical challenge you solved?
A: Maintaining a persistent budget/session context across async requests and making the governance logic consistent across every call.

### Q10. Why should judges choose your project?
A: Because it is practical, scalable, and solves a very real enterprise problem with a polished UI, real technical depth, and a clear path to revenue.

---

## 16. How to win the hackathon
### Show impact, not just code
Talk about why this matters in the real world.

### Demonstrate live value
Run the system in front of judges and show budget enforcement and insights.

### Make the UI beautiful
A polished dashboard and landing page gives the impression of product maturity.

### Be crisp in your pitch
Tell them the problem, your solution, the technology, and the impact in under 2 minutes.

### Mention scalability
Say that this can be extended to teams, agents, or enterprise AI platforms.

### Highlight novelty
The real differentiator is combining governance, cost control, and automatic optimization in one system.

---

## 17. Final closing line
Obsidian turns AI from a risky, opaque black box into a governed, measurable, and cost-aware system.