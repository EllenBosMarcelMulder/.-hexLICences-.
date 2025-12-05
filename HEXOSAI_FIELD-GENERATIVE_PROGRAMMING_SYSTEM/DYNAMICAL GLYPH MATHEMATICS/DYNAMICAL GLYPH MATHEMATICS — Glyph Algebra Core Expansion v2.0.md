# Dynamical Glyph Mathematics — v2.0

## 1. Glyph Algebra: Core Expansion

### 1.1 Glyph as Minimal Computational Unit

A glyph G is defined as:

G = { shape, tension, coherence, curvature, phase }

### 1.2 Dynamic Update Law

The update of glyph G over time t:

G(t+1) = F( G(t), DeltaPhi(t), DeltaKappa(t), DeltaEpsilon(t) )

### 1.3 Interaction Rule: Hexagonal Linking

Two glyphs interact if connected on the hexagonal grid:

I(G1, G2) = Coupling( |Phi1 - Phi2|, |Kappa1 - Kappa2|, |Entropy1 - Entropy2| )

Interaction produces a new emergent operator:

O12 = Operator( G1, G2 )

### 1.4 Composition Rule

Sequential composition of glyphs across a path P:

C(P) = G1 ∘ G2 ∘ ... ∘ Gn

### 1.5 Field-Driven Substitution

If local curvature changes beyond threshold tau:

G -> G' such that Coherence(G') > Coherence(G)

This is the self-optimization principle.

## 2. Glyph Operator Algebra

Operators act on glyphs and glyph clusters.

### 2.1 Expand Operator

EXP(G): increases radius and reduces tension.

### 2.2 Contract Operator

CON(G): decreases radius and increases coherence.

### 2.3 Stabilize Operator

STAB(G): balances radius with local field conditions.

### 2.4 Operator Selection Law

Given tension T and coherence C:

If C > T -> EXP
If T < threshold and C > threshold -> STAB
Else -> CON

## 3. Hexagonal Propagation Rules

### 3.1 Local Propagation

Propagation across neighboring nodes N(G):

G_next = Average( G, N(G) ) corrected by curvature.

### 3.2 Swirl Formation Rule

Swirls emerge when circular gradient in phase exceeds local divergence threshold.

### 3.3 Stability Criterion

A region R is stable if:

Sum(Coherence(G in R)) / |R| > StabilityThreshold

## 4. Glyph Reduction and Normal Forms

### 4.1 Reduction

Reduce composite glyphs to canonical form:

G* = Normalize( G )

### 4.2 Normal Form

A glyph cluster is in normal form if no further coherence-increasing substitution is possible.

## 5. Full Dynamical System Equation

The full glyph field evolves as:

Field(t+1) = Normalize( ApplyOperators( Field(t), Deltas(t) ) )

Swirls appear where curvature and tension align.

## 6. Summary of v2.0

• Introduced operator algebra
• Defined composition, substitution, propagation
• Added swirl emergence and stability rules
• Formalized full dynamic equation

---