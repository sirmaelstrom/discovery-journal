# How I Discovered My Own Cognitive Architecture (And Why You Might Want To)

I'd been building personal AI infrastructure for five weeks straight — chat bots, search systems, automation agents, the whole stack running sixteen hours a day. 836 commits since late January. Features shipping constantly. Fastest I'd ever moved.

And every design decision felt like a guess.

Not because I didn't know what I was doing technically. Because I didn't know *why* I was making the choices I was making. I wanted better search — but better *how*? I wanted a workspace — but organized *how*? Every answer I came up with was a preference. And preferences don't compound. They just stack.

So I stopped building and started examining the operator. Meaning me.

What I found turned into a methodology I think transfers to other people. This is the walkthrough — what the process actually looks like, what came out of it, and enough detail that you could try it yourself or decide it's not worth your time. Either way, you'll know what you're looking at.

---

## The Examination

I sat down with an AI assistant and approached it like a debugging session. Not therapy. Not journaling. Systems analysis. I had a poorly-documented legacy system — my own brain — that was exhibiting unexpected behavior, and I needed to extract the operating characteristics.

The examination was structured around seven cognitive systems. For each one, the goal was the same: surface how the system *actually behaves*, not how I think it should.

**Energy.** What charges the system? What depletes it? I discovered that I don't run on rest-recovery cycles. I run on stimulation. Rest doesn't feel restorative — it feels like understimulation. I recharge by switching to a different kind of engagement, not by stopping. That's not a preference. It's a system characteristic with direct design implications — build for variety, not for rest breaks.

**Attention.** How does focus actually move? Not "I should focus better" — how does it *behave*? I can context-switch between related tasks with almost no penalty. Force me to switch between unrelated domains and the restart cost is catastrophic. That distinction predicted something specific about how my workspace needed to handle multiple projects — dim the ones I'm not focused on, but never hide them. Out of sight, out of mind isn't a metaphor for me. It's literal.

**Motivation.** What sustains engagement? I don't detect completion — finishing something is emotionally neutral. I detect *momentum*. The feeling of making progress is the signal. This explained why task lists never worked for me. They're optimized for completion detection. I need progress visibility.

**Identity.** This is where it got uncomfortable. I feel genuine shame about my cognitive characteristics — bad recall, inability to sit still, scattered attention. Intellectually I know these are trade-offs, not deficits. The feeling doesn't care about the intellect. But naming the shame meant I could design systems that don't *trigger* it — systems built for how I actually work instead of systems that punish me for not working the way I think I should.

**Memory.** I don't have bad memory. I have *externalized* memory. My cognitive workspace is outside my skull — notes, tools, context artifacts. If I lose those, I don't lose information. I lose the entire context structure. The practical impact: my systems need fast context reconstruction. "Where was I?" has to be answerable in seconds, not minutes.

**Learning.** I've always struggled with books. Thought it was a focus problem. It's a format mismatch. I don't read linearly — I sample. I jump around, build a conceptual map, fill in details through pattern recognition. Linear material structure creates friction because I'm fighting the format to extract the pattern. Once I recognized this, I stopped blaming myself and started designing information systems that support how I actually absorb things.

**Tool alignment.** Where do existing tools feel like extensions of thought versus translation layers? I'd been using tools that wanted clean hierarchies — but my cognition wants associative webs. The friction was constant low-level cognitive load from format translation. Not broken. Just misaligned.

The whole examination took about six hours across two sessions. What came out was raw data — detailed observations about how each system actually behaves. Not aspirations. Not what I wish were true. Behavioral physics.

---

## Pattern Extraction

From the raw data, I extracted operating characteristics. Not labels — predictions.

The difference matters. "I'm a visual learner" doesn't predict anything. "I read by associative sampling, not linear consumption, which means linear material structure creates friction proportional to its length" — that predicts system requirements. It tells you what to build and what to avoid.

Here's what I extracted:

- **Runs on stimulation, not restoration.** Design implication: build for variety and switching, not for sustained deep work blocks followed by breaks.
- **Detects momentum, not completion.** Design implication: progress visibility matters more than task completion tracking.
- **Memory weakness manifests as restart penalty cost.** Design implication: fast context reconstruction is non-negotiable. Every time I sit down, the system needs to show me where I was.
- **Externalized cognitive workspace.** Design implication: the tools aren't just tools — they're part of how I think. Losing access to them isn't inconvenient, it's cognitively disabling.
- **Shame amplifies friction.** Design implication: if the system makes me feel bad about my natural patterns (by requiring recall I don't have, or forcing linear processes that fight my associative thinking), the friction doubles. The emotional layer compounds the structural one.

Each pattern has predictive power. If I know I detect momentum instead of completion, I can predict that task lists will feel punishing, that "done" won't feel satisfying, that I'll abandon systems optimized for checking boxes. That prediction lets me design around it instead of fighting it.

---

## Failure Mode Analysis

Not all failures are equal. This was the part that changed how I think about "best practices."

**Catastrophic failures** — things that destroy cognitive capacity:
- Momentum fragmentation (constant context-switching that prevents depth)
- Forced premature convergence (being required to "finish" before understanding has stabilized)
- Identity threat (being forced to work in ways that trigger shame)
- High restart penalty (losing context with no fast reconstruction path)

**Acceptable failures** — things that create mess but preserve function:
- Disorganization (messy files, scattered notes — looks bad, doesn't break cognition)
- Redundancy (multiple overlapping systems — inefficient, not catastrophic)
- Noise (too many search results — can be filtered, doesn't destroy capacity)
- Incompletion (open loops that never close — fine for momentum-driven cognition)

Here's the thing I didn't expect: most "best practices" eliminate acceptable failures by introducing catastrophic ones.

Clean desk policy? Eliminates visible mess (acceptable failure) by forcing premature organization (catastrophic for spatial thinkers). Single source of truth? Eliminates redundancy (acceptable) by creating devastating restart penalty when that source is unavailable (catastrophic for externalized memory). Strict filing hierarchies? Eliminates ambiguity (acceptable) by breaking associative retrieval (catastrophic for non-linear thinkers).

Once you map your own failure modes, you stop importing other people's solutions and start building your own. Not because their solutions are wrong — because their failure mode tolerance is different from yours.

---

## The Doctrine

From patterns and failure modes, I derived a single governing principle.

**Preserve and extend cognitive momentum.**

That's it. One directive. Every system decision filters through it. Does this feature preserve momentum or fragment it? Does this workflow sustain engagement or force premature closure? Does this interface support my cognitive patterns or fight them?

The moment the doctrine existed, everything that had felt arbitrary became testable.

That workspace feature where unrelated projects dim but don't disappear? I'd been building it on instinct and half-defending it as an aesthetic choice. It's not aesthetic. It's *mandatory*. My brain doesn't do hard context boundaries. Hide a project and it stops existing for me. Soft focus prevents my momentum from fragmenting into twenty cold-start problems every morning.

Capture without forced categorization? I thought I was being lazy about organization. I wasn't. Forcing "where does this go?" at capture time breaks momentum. The cognitive cost of taxonomy at the point of entry is catastrophic for me. Messy is acceptable. Interrupted momentum is not.

High-recall search — returning more results than you technically need? I thought I was being sloppy about precision. I wasn't. Over-retrieval isn't noise for me. It's surface area for pattern recognition. My brain doesn't know what it's looking for until it sees it. Narrow the results and you cut off the associative threads I need.

None of these were requirements I specified upfront. They emerged from applying the doctrine to observed operating characteristics. And they're load-bearing — remove any one of them and the system stops working *for me*.

---

## What This Means For You

You don't need to build personal AI infrastructure to benefit from this process. The infrastructure was my context. The methodology applies anywhere you're building systems — including the informal ones, like how you organize your desk, plan your week, or adopt new tools.

The core move is simple: stop treating your mind as a black box labeled "user" and start treating it as a system with discoverable operating characteristics.

**Energy** — What actually charges you versus depletes you? Not what should. What does.

**Attention** — How does your focus actually move? Where's the context-switching penalty high versus low?

**Motivation** — Do you detect completion or momentum? Do you need the checkmark or the sense of forward motion?

**Memory** — Do you recall or reconstruct? Is your workspace inside your head or outside it?

**Identity** — Where does shame amplify friction? Which of your natural patterns have you coded as deficits?

You don't have to map all seven systems. Start with one. The one where you feel the most friction. Ask "how does this actually work in me?" instead of "how should this work?" and see what surfaces.

If a single insight emerges — one "oh, that explains why I keep fighting this tool" or "that's why that process never stuck" — you've got the start of an operating characteristic. And from one characteristic, you can derive at least one design decision that's based on observation instead of preference.

That's the minimum viable version. One system examined. One pattern extracted. One design implication derived. Everything else is elaboration.

---

## Where This Stands

This methodology is in active development. The process I described — structured examination, pattern extraction, failure mode analysis, doctrine derivation — I've done it for myself and facilitated it for one other person. The results in both cases were significant. But two data points aren't a study.

What I can say with confidence:

- The examination process produces actionable insight. Both times, it surfaced operating characteristics that were previously implicit and made them explicit enough to design around.
- The doctrine derivation works. Having a single governing principle transformed arbitrary design decisions into testable ones.
- It transfers. The person I facilitated independently restructured their entire approach afterward — not because I told them what to do, but because they could finally see what they already knew about how they worked.

What I can't say yet:

- Whether the examination structure (seven systems, specific question sets) is optimal or just what happened to work for the people I've tried it with.
- How much facilitation skill matters versus how much the structured questions do the heavy lifting.
- Whether the process works as well for people whose cognitive patterns are very different from mine.

I'm not presenting this as a finished framework. I'm presenting it as something that worked, that has roots in established cognitive science, and that I think is worth testing more broadly. The underlying ideas — that cognitive patterns predict tool effectiveness, that minds have operating characteristics worth discovering, that shame and identity dynamics amplify friction — these aren't controversial claims. They're well-supported by existing research. The synthesis into a self-directed methodology is the part that's new, and the part that needs more testing.

If you read the fit guide and it resonated, this is the next layer of detail. If this resonates and you want the full framework — the complete question sets, the facilitation model, the applications beyond personal software — that exists too. It's a living document and it's getting refined as I learn more.

The offer is genuine: if you want to try this process, I'm happy to walk through it with you. Not because I'm selling something. Because every person who tries it either validates the methodology or shows me where it breaks. Both outcomes make it better.

---

*Justin Heath — February 2026*
*Part of an ongoing project examining how cognitive patterns affect tool adoption and system design. This is the middle version — more than the summary, less than the textbook.*
